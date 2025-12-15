<?php

namespace App\Http\Controllers\Api;

use App\Helpers;
use App\Http\Controllers\Controller;
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

            $tickets = Ticket::with(['documents', 'chats'])
                ->whereUserId($user->id)
                ->orderBy('id', 'DESC')
                ->get()
                ->map(function ($ticket) {

                    return [
                        'id'          => $ticket->id,
                        'uuid'        => $ticket->uuid,
                        'ticketId'    => $ticket->ticketId,
                        'subject'     => $ticket->subject,
                        'description' => $ticket->description,
                        'status'      => $ticket->status,
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
                                'id'              => $chat->id,
                                'uuid'            => $chat->uuid,
                                'sender_role'     => $chat->sender_role,
                                'message'         => $chat->message,
                                'created_at'      => $chat->created_at,
                                'attechment_url'  => $chat->attechment_url,
                            ];
                        }),
                    ];
                });

            return response()->json([
                'status'  => true,
                'message' => 'Tickets list fetched succesfully',
                'tickets' => $tickets
            ], 200);
        } catch (\Exception $e) {
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
            $request->validate([
                'subject' => 'required|string',
                'description' => 'required|string',

                'attachment' => 'nullable|array',
                'attachment.*' => 'image|mimes:jpg,jpeg,png,webp|max:5048',
            ]);


            $ticket = Ticket::create([
                'user_id' => $user->id,
                'user_role' => $user->role,
                'subject' => $request->subject,
                'description' => $request->description,
            ]);

            if ($request->hasFile('attachment')) {
                foreach ($request->attachment as $photo) {
                    $fileName = Helpers::shortUuid() . '.' . $photo->getClientOriginalExtension();
                    $photo->storeAs('attachment_photos', $fileName, 'public');
                    TicketDocument::create([
                        'ticket_id'    => $ticket->id,
                        'attechement'      => $fileName,
                    ]);
                }
            }

            $msg = "ticket submit succesfully";
            activityLog($user, "ticket submit succesfully", $msg);
            $ticket->load('documents');

            return response()->json([
                'success' => true,
                'message' => 'Ticket submitted successfully',
                'data' => $ticket
            ]);
        } catch (Exception $e) {
            $msg = "error during submit ticket - " . $e->getMessage();
            activityLog($request->user(), "error during submit ticket", $msg);

            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
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

            $ticket = Ticket::with(['documents', 'chats'])
                ->where('uuid', $uuid)
                ->where('user_id', $user->id) // security check
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
                'status'      => $ticket->status,
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
                'ticket_status' => 'closed'
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
