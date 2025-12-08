<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\User;
use App\Models\UserChat;
use Exception;
use Illuminate\Http\Request;

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
                        'attechment'  => $msg->attechment,
                        'created_at'  => $msg->created_at,
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
                'to_user'     => 'required|exists:users,id',
                'booking_id'  => 'required|exists:bookings,id',
                'message'     => 'required|string',
                'attachment.*' => 'nullable|file|mimes:jpeg,jpg,png,webp,pdf,doc,docx,mp4,mov,avi,mkv|max:51200',
            ]);


            $toUser = User::find($request->to_user);
            if (!$toUser) {
                return response()->json([
                    'status' => false,
                    'message' => "User does not exist",
                ], 404);
            }

            $booking = Booking::find($request->booking_id);
            if (!$booking) {
                return response()->json([
                    'status' => false,
                    'message' => "Booking does not exist",
                ], 404);
            }

            UserChat::create([
                'from' => $user->id,
                'to' => $toUser->id,
                'sender_role' => $user->role,
                'booking_id' => $booking->id,
                'message' => $request->message,
            ]);

            return response()->json([
                'status' => true,
                'message' => "Message sent",
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
