<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Notification;
use App\Models\Ticket;
use App\Models\UserChat;
use App\PushNotification;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

use function App\getNotificationTemplate;
use function App\parseNotificationTemplate;
use function App\uploadRequestFile;

class SuperAdminTicketController extends Controller
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
     * Display Resourse Page
     * @param Request $request
     * @return mixed
     */

    public function list(Request $request)
    {
        $search      = $request->query('search');
        $status      = $request->query('status');

        $tickets = Ticket::with(['booking', 'user'])
            ->orderBy('created_at', 'DESC')
            ->when($search, function ($q) use ($search) {
                $q->where(function ($q) use ($search) {
                    $q->where('ticketId', 'LIKE', "%{$search}%")
                        ->orWhere('subject', 'LIKE', "%{$search}%");
                });
            })
            ->when($status, function ($q) use ($status) {
                $q->where('ticket_status', $status);
            })
            ->paginate($this->per_page ?? 50)
            ->withQueryString();

        return Inertia::render('SuperAdmin/Tickets/List', [
            'list'       => $tickets,
            'search'     => $search,
            'status'     => $status
        ]);
    }



    /**
     * Ticket Chat Messages List
     * @param Request $request
     * @return mixed
     */
    public function chats(Request $request, $uuid = null)
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
                $ticket = Ticket::where('uuid', $uuid)->first();

                if (!$ticket) {
                    abort(404, 'Ticket not found');
                }

                $customer = $ticket->user;
                $messages = UserChat::where(function ($q) use ($ticket) {

                    // Always include ticket chats
                    $q->where('ticket_id', $ticket->id);

                    // Only include booking chats IF booking exists
                    if (!empty($ticket->booking_id)) {
                        $q->orWhere('booking_id', $ticket->booking_id);
                    }
                })
                    ->with(['fromUser:id,name', 'toUser:id,name'])
                    ->orderBy('created_at', 'ASC') // keep ASC for chat UI
                    ->get()
                    ->map(function ($msg) {
                        return [
                            'uuid'           => $msg->uuid,
                            'from'           => $msg->fromUser->name ?? null,
                            'to'             => $msg->toUser->name ?? null,
                            'message'        => $msg->message,
                            'sender_role'    => $msg->sender_role,
                            'attechment'     => $msg->attechment,
                            'attechment_url' => $msg->attechment_url,
                            'created_at'     => $msg->created_at,

                            // ⭐ Helps frontend show label if needed
                            'source' => $msg->ticket_id ? 'ticket' : 'booking',
                        ];
                    });


                if (empty($ticket->booking_id)) {
                    $canAdminSendMsg = true;
                } else {
                    $canAdminSendMsg = UserChat::where(function ($q) use ($ticket) {

                        $q->where('ticket_id', $ticket->id)
                            ->orWhere('booking_id', $ticket->booking_id);
                    })
                        ->where(function ($q) {
                            $q->where('sender_role', 'superadmin')
                                ->orWhere('receiver_role', 'superadmin');
                        })
                        ->exists();
                }
            }

            return Inertia::render('SuperAdmin/Chats/List', [
                'chatType'        => 'ticket',
                'chat'            => $ticket, // ⭐ unified object
                'otherBookings'   => $otherBookings,
                'selectedUuid'    => $uuid,
                'messages'        => $messages,
                'customer'        => $customer,
                'vehicle'         => null,
                'canAdminSendMsg' => $canAdminSendMsg,
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
        $ticket = Ticket::where('uuid', $uuid)->first();
        if (!$ticket) {
            return back()->with('error', "Ticket does not exist");
        }

        $customer = $ticket->user;
        $mechanic = $ticket->booking->mechanic;
        $booking = $ticket->booking;

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
                        'msg_type' => 'booking'
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

        if ($chat->from != $ticket->user_id) {
            $ticket->update([
                'ticket_status' => 'in_process',
                'status' => 'in_process',
            ]);
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
                        'msg_type' => 'booking'
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
     * @param strign UUID $uuid Ticket UUID
     * */

    public function updateChatsStatus(Request $request, $uuid)
    {
        $ticket = Ticket::firstWhere('uuid', $uuid);
        if (!$ticket) {
            return redirect()->back()->with('error', "Ticket not found!");
        }

        if (!is_bool($request->status)) {
            return redirect()->back()->with('error', "Invalid Payload!");
        }

        $ticket->update(['chat_status' => ($request->status ? 1 : 0)]);
        return redirect()->back()->with('success', "Ticket chats " . ($request->status ? 'active' : 'inactive') . " successfully");
    }



    /**
     * Update Ticket Status
     * @param Request $request
     * @param strign UUID $uuid Ticket UUID
     * */

    public function updateStatus(Request $request, $uuid)
    {
        $request->validate([
            'status' => 'required|string'
        ]);

        $ticket = Ticket::where('uuid', $uuid)->firstOrFail();
        if (!$ticket) {
            return redirect()->back()->with('error', "Ticket does not exist");
        }

        $ticket->update([
            'ticket_status' => $request->status,
            'status' => $request->status
        ]);

        return redirect()->back()->with('success', "Ticket status updated as " . $request->status . " successfully");
    }
}
