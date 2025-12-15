<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Exception;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * Fetch Notifications Controller
     * @return mixed
     */
    public function notificationsList(Request $request)
    {
        try {
            $user = $request->user();

            $notifications = Notification::where('status', 0)
                ->where('user_id', $user->id)
                ->orderBy('created_at', 'DESC')
                ->get();

            $data = $notifications->map(function ($notification) {
                return [
                    "uuid" => $notification->uuid,
                    "type" => $notification->type,
                    "data" => json_decode($notification->data, true),
                    "status" => $notification->status ? 'read' : 'not read',
                ];
            });

            return response()->json([
                'status'  => true,
                'message' => "Notifications list fetched",
                'list'    => $data
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status'  => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }


    /**
     * Update Notification Status
     * @param string $uuid Notification UUID
     * @return mixed
     */
    public function updateStatus(Request $request, $uuid)
    {
        try {
            $request->user();
            $notification = Notification::whereUuid($uuid)->first();

            if (!$notification) {
                return response()->json(['status' => false, 'message' => 'Notification not found'], 404);
            }

            $notification->update([
                'status' => 1,
            ]);

            return response()->json([
                'status' => true,
                'message' => "Notification mark as read",
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
