<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\SuperAdmin;
use App\Models\Ticket;
use App\Models\User;
use App\Models\UserChat;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;

use function App\uploadRequestFile;

class ChatController extends Controller
{
    /**
     * Chat Messages List
     * @param Request $request
     * @return mixed
     */
    public function chatMessagesList(Request $request, $uuid)
    {
        try {
            $booking = Booking::firstWhere('uuid', $uuid);

            if (!$booking) {
                return response()->json([
                    'status' => false,
                    'message' => "Booking does not exist",
                ], 404);
            }

            // Load users related to chats
            $messages = UserChat::where('booking_id', $booking->id)
                ->with(['fromUser:id,name', 'toUser:id,name'])
                ->get()
                ->map(function ($msg) {
                    return [
                        'uuid'        => $msg->uuid,
                        'from'        => $msg->fromUser->name ?? null,
                        'to'          => $msg->toUser->name ?? null,
                        'sender_role' => $msg->sender_role,
                        'message'     => $msg->message,
                        'attachment_url' => $msg->attechment_url,
                        'time' => $msg->created_at->format('d M Y · h:i A'),
                    ];
                });

            return response()->json([
                'status' => true,
                'message' => "Chat messages fetched",
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
            $booking = null;
            $ticket = null;

            $request->validate([
                'to_user'       => 'required|integer',

                'message'       => 'required_without:attachment|nullable|string',

                'booking_id'    => 'nullable',
                'ticket_id'     => 'nullable|integer',

                'attachment'    => 'required_without:message|nullable|array',
                'attachment.*'  => 'file|mimes:jpeg,jpg,png,webp,pdf,doc,docx,mp4,mov,avi,mkv|max:51200',
            ]);

            $toUser = User::find($request->to_user);
            if (!$toUser) {
                return response()->json([
                    'status' => false,
                    'message' => 'User does not exist',
                ], 404);
            }

            if ($request->booking_id) {
                $booking = Booking::with(['vehicle.vehile_make'])->firstWhere('uuid', $request->booking_id);

                if (!$booking) {
                    return response()->json([
                        'status' => false,
                        'message' => 'Booking does not exist',
                    ], 404);
                }
            }

            if ($request->ticket_id) {
                $ticket = Ticket::find($request->ticket_id);

                if (!$ticket) {
                    return response()->json([
                        'status' => false,
                        'message' => 'Ticket does not exist',
                    ], 404);
                }
            } elseif ($booking) {
                $ticket = Ticket::find($booking->id)
                    ->where('user_id', $user->id)
                    ->first();

                if (!$ticket) {
                    $makeName = $booking->vehicle?->vehile_make?->name ?? 'N/A';
                    $title = '#' . $booking->booking_id . ' (' . $makeName . ')';

                    $ticket = Ticket::create([
                        'user_id'     => $user->id,
                        'user_role'   => $user->role,
                        'booking_id'  => $booking->id,
                        'subject'     => $title,
                        'description' => 'Chat initiated from booking',
                    ]);
                }
            }

            // 4️⃣ Neither ticket nor booking provided
            else {
                return response()->json([
                    'status' => false,
                    'message' => 'Booking or ticket is required',
                ], 422);
            }

            /* -------------------- Create Chat -------------------- */
            $chat = UserChat::create([
                'from'           => $user->id,
                'to'             => $toUser->id,
                'ticket_id'      => $ticket->id,
                'booking_id'     => $booking?->id,
                'sender_role'    => $user->role,
                'receiver_role'  => $toUser->role,
                'message'        => $request->message,
            ]);

            /* -------------------- Attachments -------------------- */
            if ($request->hasFile('attachment')) {
                uploadRequestFile(
                    $request,
                    'attachment',
                    $chat,
                    'chat_attachments',
                    'attachment'
                );
            }

            /* -------------------- Response -------------------- */
            return response()->json([
                'status' => true,
                'message' => 'Message sent',
                'chat' => [
                    'id' => $chat->id,
                    'ticket_id' => $ticket->id,
                    'booking_id' => $booking?->id,
                    'message' => $chat->message,
                    'attachment_url' => $chat->attachment_url,
                    'time' => $chat->created_at->format('d M Y · h:i A'),
                ]
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
