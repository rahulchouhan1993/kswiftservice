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

            // 🔹 Counts (SQL level – fast)
            $readCount = Notification::whereUserId($user->id)
                ->where('status', 1)
                ->count();

            $unreadCount = Notification::whereUserId($user->id)
                ->where('status', 0)
                ->count();

            // 🔹 Only UNREAD notifications in list
            $notifications = Notification::whereUserId($user->id)
                ->where('status', 0)
                ->orderBy('created_at', 'DESC')
                ->get();

            $data = $notifications->map(function ($notification) {
                return [
                    'uuid'   => $notification->uuid,
                    'type'   => $notification->type,
                    'data'   => json_decode($notification->data, true),
                    'status' => 'not read',
                ];
            });

            return response()->json([
                'status'              => true,
                'message'             => 'Notifications list fetched',
                'list'                => $data,
                'read_notification'   => $readCount,
                'unread_notification' => $unreadCount,
            ], 200);
        } catch (\Exception $e) {
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



    /**
     * Mark All Notification Read
     * @return mixed
     */
    public function markAllNotificationsRead(Request $request)
    {
        try {
            $user = $request->user();

            Notification::whereUserId($user->id)
                ->update([
                    'status' => 1
                ]);

            return response()->json([
                'status'  => true,
                'message' => 'All notifications marked as read',
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status'  => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
