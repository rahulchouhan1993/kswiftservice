<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AppFeedback;
use App\Models\Booking;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

use function App\activityLog;

class FeedbackController extends Controller
{
    /**
     * Submit Feedback
     * @param Request $request
     * @return mixed
     */
    public function submitFeedback(Request $request)
    {
        try {
            $user = $request->user();
            $rules = [
                'rating' => ['required', 'numeric', 'between:0,5'],
                'feedback' => ['required', 'string'],
                'booking_uuid' => [
                    'nullable',
                    Rule::exists('bookings', 'uuid')->where(function ($q) use ($user) {
                        $q->where('user_id', $user->id);
                    }),
                ],
            ];
            $request->validate($rules);

            $booking = null;
            if ($request->booking_uuid) {
                $booking = Booking::where('uuid', $request->booking_uuid)->first();
                if (!$booking) {
                    return response()->json([
                        'status' => false,
                        'message' => 'Booking does not exist with this uuid, please check booking uuid properly',
                    ]);
                }
            }

            $feedback = AppFeedback::create([
                'booking_id' => $booking ? $booking->id : null,
                'user_id' => $user->id,
                'given_by' => $user->role,
                'rating' => $request->rating,
                'feedback' => $request->feedback,
            ]);

            $msg = "app feedback submitted by " . $user->name ?? 'customer';
            activityLog($user, "app feedback submitted", $msg);

            return response()->json([
                'status' => true,
                'message' => 'Garage added successfully.',
                'feedback' => $feedback
            ]);
        } catch (Exception $e) {
            $msg = "error during submit app feedback - " . $e->getMessage();
            activityLog($request->user(), "error during app feedback submittion time", $msg);

            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
