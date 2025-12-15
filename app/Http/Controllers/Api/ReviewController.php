<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\BookingReview;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;

use function App\activityLog;

class ReviewController extends Controller
{

    /**
     * Fetch Reviews List
     * @return mixed
     */
    public function list(Request $request)
    {
        try {
            $user = $request->user();

            $reviews = BookingReview::with(['customer:id,name'])
                ->when($user->role === 'customer', function ($query) use ($user) {
                    $query->whereUserId($user->id);
                })
                ->when($user->role === 'mechanic', function ($query) use ($user) {
                    $query->whereMechanicId($user->id);
                })
                ->orderBy('id', 'DESC')
                ->get()
                ->map(function ($review) {
                    return [
                        'id'       => $review->id,
                        'review'   => $review->review,
                        'feedback' => $review->feedback,
                        'date'     => Carbon::parse($review->created_at)->format('d M Y'),

                        'user' => $review->customer ? [
                            'id'   => $review->customer->id,
                            'name' => $review->customer->name,
                        ] : null,
                    ];
                });

            return response()->json([
                'status'  => true,
                'message' => 'Reviews list fetched succesfully',
                'reviews' => $reviews
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

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

            if ($booking->booking_status != 'completed') {
                return response()->json([
                    'status' => false,
                    'message' => "Ticket not completed yet. Review cannot be submitted."
                ], 404);
            }

            $review = BookingReview::create([
                'user_id' => $user->id,
                'garage_id' => $booking->garage_id,
                'mechanic_id' => $booking->mechanic_id,
                'booking_id' => $booking->id,
                'review' => $request->review,
                'feedback' => $request->feedback,
            ]);

            $booking->update([
                'booking_status' => 'closed'
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
