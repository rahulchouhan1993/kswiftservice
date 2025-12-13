<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
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
            $request->validate([
                'to_user'     => 'required',
                'booking_id'  => 'required',
                'message'     => 'required|string',
                'attachment.*' => 'nullable|file|mimes:jpeg,jpg,png,webp,pdf,doc,docx,mp4,mov,avi,mkv|max:51200',
            ]);


            $toUser = User::firstWhere('uuid', $request->to_user);
            if (!$toUser) {
                return response()->json([
                    'status' => false,
                    'message' => "User does not exist",
                ], 404);
            }

            $booking = Booking::with(['vehicle', 'vehicle.vehile_make'])->firstWhere('uuid', $request->booking_id);
            if (!$booking) {
                return response()->json([
                    'status' => false,
                    'message' => "Booking does not exist",
                ], 404);
            }

            $title = '#' . $booking->booking_id . "(" . $booking->vehicle->vehile_make->name . ")";
            $ticket = Ticket::create([
                'user_id' => $user->id,
                'user_role' => $user->role,
                'subject' => $title,
                'description' => "Hi there, I need to discuss things further with you.",
            ]);

            $chat = UserChat::create([
                'from' => $user->id,
                'to' => $toUser->id,
                'ticket_id' => $ticket->id,
                'sender_role' => $user->role,
                'booking_id' => $booking->id,
                'message' => $request->message,
            ]);

            if ($request->attechment) {
                uploadRequestFile($request, 'attechment', $chat, 'chat_attechements', 'attechment');
            }

            return response()->json([
                'status' => true,
                'message' => "Message sent",
                'chat' => [
                    'id' => $chat->id,
                    'message' => $chat->message,
                    'attachment_url' => $chat->attechment_url,
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
