<?php

namespace App\Http\Controllers\Api;

use App\Helpers;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Ticket;
use App\Models\TicketDocument;
use Exception;
use Illuminate\Http\Request;

use function App\activityLog;
use function App\uploadRequestFile;

class TicketController extends Controller
{
    /**
     * Fetch Tickets List
     * @return mixed
     */
    public function getTicketsList(Request $request)
    {
        try {
            $user = $request->user();

            $tickets = Ticket::with(['documents', 'chats', 'booking'])
                ->whereUserId($user->id)
                ->orderByRaw("
                    CASE
                        WHEN ticket_status = 'closed' THEN 1
                        ELSE 0
                    END
                ")
                // ->orderBy('created_at', 'DESC')
                // ->orderBy('id', 'DESC')
                ->get()
                ->map(function ($ticket) {
                    return [
                        'id'          => $ticket->id,
                        'uuid'        => $ticket->uuid,
                        'ticketId'    => $ticket->ticketId,
                        'subject'     => $ticket->subject,
                        'description' => $ticket->description,
                        'status'      => $ticket->ticket_status,
                        'created_at'  => $ticket->created_at,

                        'documents' => $ticket->documents->map(fn($doc) => [
                            'id'             => $doc->id,
                            'uuid'           => $doc->uuid,
                            'attachment_url' => $doc->attachment_url,
                        ]),

                        'chats' => $ticket->chats->map(fn($chat) => [
                            'id'             => $chat->id,
                            'uuid'           => $chat->uuid,
                            'sender_role'    => $chat->sender_role,
                            'message'        => $chat->message,
                            'created_at'     => $chat->created_at,
                            'attachment_url' => $chat->attechment_url,
                        ]),

                        'booking' => $ticket->booking ? [
                            'id'         => $ticket->booking->id,
                            'uuid'       => $ticket->booking->uuid,
                            'booking_id' => $ticket->booking->booking_id,
                            'created_at' => $ticket->booking->created_at,
                            'delivery_date' => $ticket->booking->delivered_at,
                            'assigned_date' => $ticket->booking->assigned_date,
                        ] : null,
                    ];
                });

            return response()->json([
                'status'  => true,
                'message' => 'Tickets list fetched successfully',
                'tickets' => $tickets,
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status'  => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }


    /**
     * Submit Ticket
     * @param Request $request
     * @return mixed
     */
    public function submitTicket(Request $request)
    {
        try {
            $user = $request->user();
            $booking = null;

            $request->validate([
                'subject' => 'required|string',
                'description' => 'required|string',
                'booking_id' => 'nullable',
                'attachment' => 'nullable|array',
                'attachment.*' => 'image|mimes:jpg,jpeg,png,webp|max:5048',
            ]);

            if ($request->booking_id) {
                $booking = Booking::find($request->booking_id);
                if (!$booking) {
                    return response()->json([
                        'status' => false,
                        'message' => "Booking does not exist."
                    ], 404);
                }
            }

            $ticket = Ticket::create([
                'user_id'     => $user->id,
                'user_role'   => $user->role,
                'subject'     => $request->subject,
                'booking_id'  => $booking?->id,
                'description' => $request->description,
            ]);

            if ($request->hasFile('attachment')) {
                foreach ($request->file('attachment') as $photo) {
                    $fileName = Helpers::shortUuid() . '.' . $photo->getClientOriginalExtension();
                    $photo->storeAs('attachment_photos', $fileName, 'public');

                    TicketDocument::create([
                        'ticket_id'  => $ticket->id,
                        'attechement' => $fileName,
                    ]);
                }
            }

            activityLog($user, "ticket submit succesfully", "ticket submit succesfully");
            $ticket->load('documents');

            return response()->json([
                'success' => true,
                'message' => 'Ticket submitted successfully',
                'data' => $ticket
            ]);
        } catch (Exception $e) {
            activityLog($request->user(), "error during submit ticket", $e->getMessage());

            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }




    /**
     * Fetch Ticket Details
     * @param string $uuid Ticket UUID
     * @return mixed
     */
    public function getTicketDetails(Request $request, $uuid)
    {
        try {
            $user = $request->user();

            $ticket = Ticket::with(['documents', 'chats', 'booking'])
                ->where('uuid', $uuid)
                ->where('user_id', $user->id)
                ->first();

            if (!$ticket) {
                return response()->json([
                    'status'  => false,
                    'message' => 'Ticket does not exist',
                ], 404);
            }

            $ticketData = [
                'id'          => $ticket->id,
                'uuid'        => $ticket->uuid,
                'ticketId'    => $ticket->ticketId,
                'subject'     => $ticket->subject,
                'description' => $ticket->description,
                'status'      => $ticket->ticket_status,
                'created_at'  => $ticket->created_at,

                'documents'   => $ticket->documents->map(function ($doc) {
                    return [
                        'id'             => $doc->id,
                        'uuid'           => $doc->uuid,
                        'created_at'     => $doc->created_at,
                        'attachment_url' => $doc->attachment_url,
                    ];
                }),

                'chats' => $ticket->chats->map(function ($chat) {
                    return [
                        'id'             => $chat->id,
                        'uuid'           => $chat->uuid,
                        'sender_role'    => $chat->sender_role,
                        'message'        => $chat->message,
                        'created_at'     => $chat->created_at,
                        'attechment_url' => $chat->attechment_url,
                    ];
                }),
            ];

            return response()->json([
                'status'  => true,
                'message' => 'Ticket details fetched succesfully',
                'ticket'  => $ticketData
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status'  => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }



    /**
     * Update Ticket Status
     * @param string $uuid Ticket UUID
     * @return mixed
     */
    public function closeTicket(Request $request, $uuid)
    {
        try {
            $user = $request->user();
            $ticket = Ticket::firstWhere('uuid', $uuid);
            if (!$ticket) {
                return response()->json([
                    'status' => false,
                    'message' => 'Ticket does not exist',
                ], 500);
            }

            if ($ticket->user_id != $user->id) {
                return response()->json([
                    'status' => false,
                    'message' => 'Sorry, you cant close this ticket',
                ], 500);
            }

            $ticket->update([
                'ticket_status' => 'closed',
                'status' => 'resolved'
            ]);

            $msg = "ticket closed by - " . $user->name;
            activityLog($user, "ticket closed", $msg);

            return response()->json([
                'status' => true,
                'message' => 'Ticket closed succesfully',
            ]);
        } catch (Exception $e) {
            $msg = "error during ticket close - " . $e->getMessage();
            activityLog($request->user(), "error during ticket close", $msg);

            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
