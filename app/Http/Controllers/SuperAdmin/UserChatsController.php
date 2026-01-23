<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Notification;
use App\Models\UserChat;
use App\PushNotification;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

use function App\getNotificationTemplate;
use function App\parseNotificationTemplate;
use function App\uploadRequestFile;

class UserChatsController extends Controller
{
    use PushNotification;

    protected $per_page;
    protected $auth;
    public function __construct()
    {
        $this->per_page = env('PER_PAGE', 50);
        $this->auth = Auth::guard('superadmin')->user();
    }


    /**
     * Chat Messages List
     * @param Request $request
     * @return mixed
     */
    public function list(Request $request, $uuid)
    {
        try {
            $booking = Booking::firstWhere('uuid', $uuid);
            $otherBookings = Booking::with(['vehicle', 'vehicle.vehile_make'])
                ->whereUserId($booking->user_id)
                ->orderBy('created_at', "DESC")
                ->get()
                ->map(function ($b) {
                    return [
                        'uuid'           => $b->uuid,
                        'booking_id'     => $b->booking_id,
                        'vehicle_number' => $b->vehicle->vehicle_number ?? null,
                        'vehicle_make'   => $b->vehicle->vehile_make->name ?? null,
                        'booking_date'   => $b->date,
                    ];
                });

            if (!$booking) {
                return response()->json([
                    'status' => false,
                    'message' => "Booking does not exist",
                ], 404);
            }

            $canAdminSendMsg = UserChat::where('booking_id', $booking->id)
                ->where(function ($q) {
                    $q->where('sender_role', 'superadmin')
                        ->orWhere('receiver_role', 'superadmin');
                })
                ->exists();

            $messages = UserChat::where('booking_id', $booking->id)
                ->with(['fromUser:id,name', 'toUser:id,name'])
                ->get()
                ->map(function ($msg) {
                    return [
                        'uuid'        => $msg->uuid,
                        'from'        => $msg->fromUser->name ?? null,
                        'to'          => $msg->toUser->name ?? null,
                        'message'     => $msg->message,
                        'sender_role' => $msg->sender_role,
                        'attechment'  => $msg->attechment,
                        'attechment_url' => $msg->attechment_url,
                        'created_at'  => $msg->created_at,
                    ];
                });

            return Inertia::render("SuperAdmin/Chats/List", [
                'messages'       => $messages,
                'otherBookings'  => $otherBookings,
                'booking'        => $booking,
                'auth'           => ['user' => $request->user()],
                'canAdminSendMsg' => true,
                'booking' => $booking
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }


    /**
     * Send Message
     * @param Request $request
     * @return mixed
     */
    public function sendMessage(Request $request, $uuid)
    {
        $request->validate([
            'message' => 'nullable|string|required_without:attachment',
            'attachment' => 'nullable|file|required_without:message|mimes:jpg,jpeg,png,pdf,mp4|max:51200',
        ]);
        $booking = Booking::where('uuid', $uuid)->first();
        if (!$booking) {
            return back()->with('error', "Booking does not exist");
        }

        $customer = $booking->customer;
        $mechanic = $booking->mechanic;
        $ticket = $booking->ticket;

        if ($customer) {
            $chat = UserChat::create([
                'from'           => $this->auth->id,
                'to'             => $customer->id,
                'ticket_id'      => $booking->id ?? null,
                'booking_id'     => $booking?->id,
                'sender_role'    => 'superadmin',
                'receiver_role'  => $customer->role,
                'message'        => $request->message,
            ]);

            if (env("CAN_SEND_PUSH_NOTIFICATIONS")) {
                $deviceToken = optional($customer->fcm_token)->token;
                if ($deviceToken) {
                    $temp = getNotificationTemplate('new_ticket_message_received');
                    $uData = [
                        'CUSTOMER_NAME' => $customer->name,
                        'TICKET_ID' => $ticket ? $ticket->ticketId : '--'
                    ];

                    $tempWData = parseNotificationTemplate($temp, $uData);
                    $data = [
                        'type'          => 'new_ticket_message_received',
                        'ticket_uuid'  => (string) $ticket->uuid,
                        'chat_uuid'  => (string) $chat->uuid,
                        'hasReview'     => $booking->review ? '1' : '0',
                    ];

                    $resp = $this->sendPushNotification($deviceToken, $tempWData, $data);
                    if (is_array($resp) && isset($resp['name'])) {
                        Notification::create([
                            'user_id' => $customer->id,
                            'type'    => 'push',
                            'data'    => json_encode($tempWData, JSON_UNESCAPED_UNICODE),
                        ]);
                    }
                }
            }

            if ($request->hasFile('attachment')) {
                $img = uploadRequestFile($request, 'attachment', $chat, 'chat_attechments', 'attechment', null, null, true);
            }
        }


        if ($mechanic) {
            $chat = UserChat::create([
                'from'           => $this->auth->id,
                'to'             => $mechanic->id,
                'ticket_id'      => $booking->id ?? null,
                'booking_id'     => $booking?->id,
                'sender_role'    => 'superadmin',
                'receiver_role'  => $mechanic->role,
                'message'        => $request->message,
            ]);

            if (env("CAN_SEND_PUSH_NOTIFICATIONS")) {
                $deviceToken = optional($mechanic->fcm_token)->token;
                if ($deviceToken) {
                    $temp = getNotificationTemplate('new_ticket_message_received');
                    $uData = [
                        'CUSTOMER_NAME' => $mechanic->name,
                        'TICKET_ID' => $ticket ? $ticket->ticketId : '--'
                    ];

                    $tempWData = parseNotificationTemplate($temp, $uData);
                    $data = [
                        'type'          => 'new_ticket_message_received',
                        'ticket_uuid'  => (string) $ticket->uuid,
                        'chat_uuid'  => (string) $chat->uuid,
                        'hasReview'     => $booking->review ? '1' : '0',
                    ];

                    $resp = $this->sendPushNotification($deviceToken, $tempWData, $data);
                    if (is_array($resp) && isset($resp['name'])) {
                        Notification::create([
                            'user_id' => $mechanic->id,
                            'type'    => 'push',
                            'data'    => json_encode($tempWData, JSON_UNESCAPED_UNICODE),
                        ]);
                    }
                }
            }

            if ($request->hasFile('attachment')) {
                $img = uploadRequestFile($request, 'attachment', $chat, 'chat_attechments', 'attechment', null, null, true);
            }
        }

        return back()->with('success', "Message sent succesfully");
    }
}
