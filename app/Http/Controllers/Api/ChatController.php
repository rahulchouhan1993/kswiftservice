<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Notification;
use App\Models\SuperAdmin;
use App\Models\Ticket;
use App\Models\User;
use App\Models\UserChat;
use App\PushNotification;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Throwable;

use function App\getNotificationTemplate;
use function App\parseNotificationTemplate;
use function App\uploadRequestFile;

class ChatController extends Controller
{
    use PushNotification;

    /**
     * Chat Messages List
     * @param Request $request
     * @return mixed
     */
    public function chatMessagesList(Request $request, $uuid)
    {
        try {
            $user = $request->user();

            $booking = Booking::firstWhere('uuid', $uuid);
            if (!$booking) {
                return response()->json([
                    'status' => false,
                    'message' => "Booking does not exist",
                ], 404);
            }

            // Determine receiver role dynamically
            $receiverRole = $user->role === 'customer' ? 'customer' : 'mechanic';

            // Mark unread messages as read (ONLY receiver messages)
            UserChat::where('booking_id', $booking->id)
                ->where('receiver_role', $receiverRole)
                ->where('to', $user->id)
                ->whereNull('read_time')
                ->update([
                    'read_time' => Carbon::now(),
                ]);

            // Fetch chats
            $messages = UserChat::where('booking_id', $booking->id)
                ->with(['fromUser:id,name', 'toUser:id,name'])
                ->orderBy('created_at', 'asc')
                ->get()
                ->map(function ($msg) {
                    return [
                        'uuid' => $msg->uuid,
                        'from' => $msg->fromUser->name ?? null,
                        'to' => $msg->toUser->name ?? null,
                        'sender_role' => $msg->sender_role,
                        'message' => $msg->message,
                        'attachment_url' => $msg->attechment_url,
                        'time' => $msg->created_at->format('d M Y · h:i A'),
                        'read_time' => $msg->read_time ? $msg->read_time : null,
                    ];
                });

            return response()->json([
                'status' => true,
                'message' => "Chat messages fetched",
                'is_chats_active' => (bool) $booking->booking_chats_status,
                'chats' => $messages
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }




    /**
     * Send Message
     * @param equest $request
     * @return mixed
     */
    public function sendMessage(Request $request)
    {
        try {
            $user = $request->user();
            $request->validate([
                'to_user' => 'required|exists:users,id',
                'message' => 'nullable|string|required_without:attachment',
                'attachment' => 'nullable|file|required_without:message|mimes:jpg,jpeg,png,pdf,mp4|max:51200',
                'booking_id' => 'nullable|string',
                'ticket_id' => 'nullable|string',
            ]);

            $toUser = User::find($request->to_user);
            if (!$toUser) {
                return response()->json([
                    'status'  => false,
                    'message' => 'User does not exist',
                ], 404);
            }

            $booking = null;
            if ($request->filled('booking_id')) {
                $booking = Booking::with('vehicle.vehile_make')
                    ->where('uuid', $request->booking_id)
                    ->first();

                if (!$booking) {
                    return response()->json([
                        'status'  => false,
                        'message' => 'Booking does not exist',
                    ], 404);
                }

                if ($booking->booking_chats_status == 0) {
                    return response()->json([
                        'status'  => false,
                        'message' => 'You cannot send message, chats disabled by admin.',
                    ], 404);
                }
            }

            $ticket = null;
            if ($request->filled('ticket_id')) {
                $ticket = Ticket::where('uuid', $request->ticket_id)->first();

                if (!$ticket) {
                    return response()->json([
                        'status'  => false,
                        'message' => 'Ticket does not exist',
                    ], 404);
                }
            }

            if (!$ticket) {
                if ($booking) {
                    $makeName = $booking->vehicle?->vehile_make?->name ?? 'N/A';
                    $subject  = '#' . $booking->booking_id . ' (' . $makeName . ')';

                    $ticket = Ticket::create([
                        'user_id'     => $user->id,
                        'user_role'   => $user->role,
                        'booking_id'  => $booking->id,
                        'subject'     => $subject,
                        'description' => 'Chat initiated from booking',
                    ]);
                } else {
                    $ticket = Ticket::create([
                        'user_id'     => $user->id,
                        'user_role'   => $user->role,
                        'subject'     => 'General Chat',
                        'description' => 'General chat initiated',
                    ]);
                }
            }

            $chat = UserChat::create([
                'from'           => $user->id,
                'to'             => $toUser->id,
                'ticket_id'      => $ticket->id,
                'booking_id'     => $booking?->id,
                'sender_role'    => $user->role,
                'receiver_role'  => $toUser->role,
                'message'        => $request->message,
            ]);

            if ($user->id != $ticket->user_id) {
                $ticket->update([
                    'ticket_status' => 'in_process',
                    'status' => 'in_process',
                ]);
            }

            if (env("CAN_SEND_PUSH_NOTIFICATIONS")) {
                $deviceToken = optional($toUser->fcm_token)->token;
                if ($deviceToken) {
                    $temp = getNotificationTemplate('new_ticket_message_received');
                    $uData = [
                        'CUSTOMER_NAME' => $toUser->name,
                        'TICKET_ID' => $ticket->ticketId
                    ];

                    $tempWData = parseNotificationTemplate($temp, $uData);
                    $data = [
                        'type'          => 'new_ticket_message_received',
                        'ticket_uuid'  => (string) $ticket->uuid,
                        'chat_uuid'  => (string) $chat->uuid,
                        'hasReview'     => $booking->review ? '1' : '0',
                        'msg_type' => $ticket ? 'ticket' : 'booking'
                    ];

                    $resp = $this->sendPushNotification($deviceToken, $tempWData, $data);
                    if (is_array($resp) && isset($resp['name'])) {
                        Notification::create([
                            'user_id' => $toUser->id,
                            'type'    => 'push',
                            'data'    => json_encode($tempWData, JSON_UNESCAPED_UNICODE),
                        ]);
                    }
                }
            }

            if ($request->hasFile('attachment')) {
                $img = uploadRequestFile($request, 'attachment', $chat, 'chat_attechments', 'attechment', null, null, true);
            }

            return response()->json([
                'status'  => true,
                'message' => 'Message sent successfully',
                'chat'    => [
                    'id'            => $chat->id,
                    'ticket_id'     => $ticket->id,
                    'booking_id'    => $booking?->id,
                    'message'       => $chat->message,
                    'attachment_url' => $chat->attachment_url,
                    'time'          => $chat->created_at->format('d M Y · h:i A'),
                    'attechment' => $img ?? null
                ],
            ], 201);
        } catch (Throwable $e) {
            return response()->json([
                'status'  => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
