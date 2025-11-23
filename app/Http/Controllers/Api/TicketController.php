<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use Exception;
use Illuminate\Http\Request;

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
            $tickets = Ticket::whereUserId($user->id)->get();

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
                'subject' => 'required',
                'description' => 'required',
                'attachment' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5048',
            ]);

            // dd($request->all());

            $ticket = Ticket::create([
                'user_id' => $user->id,
                'user_role' => $user->role,
                'subject' => $request->subject,
                'description' => $request->description,
            ]);

            if ($request->hasFile('attachment')) {
                $photoPath = uploadRequestFile($request, 'attachment', $ticket, 'ticket_attachments', 'attachment');
                $ticket->update(['attachment' => $photoPath]);
            }


            return response()->json([
                'success' => true,
                'message' => 'Ticket submitted successfully',
                'data' => $ticket
            ]);
        } catch (Exception $e) {
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
    public function getTicketDetails($uuid)
    {
        try {
            $ticket = Ticket::where('uuid', $uuid)->first();

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
