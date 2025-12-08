<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\UserChat;
use Exception;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserChatsController extends Controller
{
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
                        'created_at'  => $msg->created_at,
                    ];
                });

            return Inertia::render("SuperAdmin/Chats/List", [
                'messages'       => $messages,
                'otherBookings'  => $otherBookings,
                'booking'        => $booking,
                'auth'           => ['user' => $request->user()],
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
