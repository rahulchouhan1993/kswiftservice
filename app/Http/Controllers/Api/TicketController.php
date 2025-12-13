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
            $tickets = Ticket::with(['documents'])->whereUserId($user->id)->get();

            return response()->json([
                'status' => true,
                'message' => "Tickets list fetched succesfully",
                'tickets' => $tickets
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
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
            $ticket = Ticket::with(['documents'])->where('uuid', $uuid)->first();

            if (!$ticket) {
                return response()->json([
                    'status' => false,
                    'message' => "Ticket does not exist",
                ], 404);
            }

            return response()->json([
                'status' => true,
                'message' => "Ticket details fetched succesfully",
                'ticket' => $ticket
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
