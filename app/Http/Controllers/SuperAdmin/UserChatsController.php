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
    public function list(Request $request, $uuid = null)
    {
        try {
            // Always load sidebar bookings
            $otherBookings = Booking::with(['vehicle', 'vehicle.vehile_make'])
                ->orderBy('created_at', 'DESC')
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

            // 👉 DEFAULT EMPTY STATE
            $booking = null;
            $messages = [];
            $customer = null;
            $vehicle = null;
            $canAdminSendMsg = false;

            // 👉 If booking is selected
            if ($uuid) {
                $booking = Booking::where('uuid', $uuid)->first();

                if (!$booking) {
                    abort(404, 'Booking not found');
                }

                $customer = $booking->customer;

                $vehicle = [
                    'vehicle_number' => $booking->vehicle->vehicle_number ?? null,
                    'model'          => $booking->vehicle->model ?? null,
                    'make'           => $booking->vehicle->vehile_make->name ?? null,
                ];

                $messages = UserChat::where('booking_id', $booking->id)
                    ->with(['fromUser:id,name', 'toUser:id,name'])
                    ->orderBy('created_at')
                    ->get()
                    ->map(function ($msg) {
                        return [
                            'uuid'            => $msg->uuid,
                            'from'            => $msg->fromUser->name ?? null,
                            'to'              => $msg->toUser->name ?? null,
                            'message'         => $msg->message,
                            'sender_role'     => $msg->sender_role,
                            'attechment'      => $msg->attechment,
                            'attechment_url'  => $msg->attechment_url,
                            'created_at'      => $msg->created_at,
                        ];
                    });

                $canAdminSendMsg = UserChat::where('booking_id', $booking->id)
                    ->where(function ($q) {
                        $q->where('sender_role', 'superadmin')
                            ->orWhere('receiver_role', 'superadmin');
                    })
                    ->exists();
            }

            return Inertia::render('SuperAdmin/Chats/List', [
                'otherBookings'   => $otherBookings,
                'selectedUuid'    => $uuid,
                'booking'         => $booking,
                'messages'        => $messages,
                'customer'        => $customer,
                'vehicle'         => $vehicle,
                'canAdminSendMsg' => false,
                'auth'            => ['user' => $request->user()],
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status'  => false,
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
                $deviceToken = $customer->fcm_token ? $customer->fcm_token->token : null;
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



    /**
     * Update User Status
     * @param strign UUID $uuid Booking UUID
     * */

    public function updateChatsStatus(Request $request, $uuid)
    {
        $booking = Booking::firstWhere('uuid', $uuid);
        if (!$booking) {
            return redirect()->back()->with('error', "Booking not found!");
        }

        if (!is_bool($request->status)) {
            return redirect()->back()->with('error', "Invalid Payload!");
        }

        $booking->update(['booking_chats_status' => ($request->status ? 1 : 0)]);
        return redirect()->back()->with('success', "Booking chats " . ($request->status ? 'active' : 'inactive') . " successfully");
    }
}
