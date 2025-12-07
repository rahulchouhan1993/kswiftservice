<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\BookingReview;
use Exception;
use Illuminate\Http\Request;

use function App\activityLog;

class ReviewController extends Controller
{
    /**
     * Submit Review
     * @param Request $request
     * @return mixed
     */
    public function submitReview(Request $request)
    {
        try {
            $user = $request->user();
            $request->validate([
                'booking_id' => 'required',
                'review' => 'required|integer',
                'feedback' => 'required|string',
            ]);

            $booking = Booking::find($request->booking_id);
            if (!$booking) {
                return response()->json([
                    'status' => false,
                    'message' => "Booking does not exist"
                ], 404);
            }

            $review = BookingReview::create([
                'user_id' => $user->id,
                'garage_id' => $booking->garage_id,
                'mechanic_id' => $booking->mechanic_id,
                'review' => $request->review,
                'feedback' => $request->feedback,
            ]);

            $msg = "user submit review for service";
            activityLog($user, "review submitted", $msg);

            return response()->json([
                'success' => true,
                'message' => 'Review submitted successfully',
                'data' => $review
            ]);
        } catch (Exception $e) {
            $msg = "error during submit review - " . $e->getMessage();
            activityLog($request->user(), "error during submit review", $msg);

            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
}
