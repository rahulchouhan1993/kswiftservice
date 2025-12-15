<?php

namespace App\Http\Controllers\SuperAdmin;

use App\FacebookApi;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Garage;
use App\Models\MechanicJob;
use App\Models\Notification;
use App\Models\User;
use App\PushNotification;
use Illuminate\Http\Request;
use Inertia\Inertia;

use function App\createMessageData;
use function App\createMessageHistory;
use function App\generateParameters;
use function App\getNotificationTemplate;
use function App\parseNotificationTemplate;

class SuperAdminBookingController extends Controller
{
    protected $per_page;
    use PushNotification;

    public function __construct()
    {
        $this->per_page = env('PER_PAGE', 50);
    }

    /**
     * Display Resourse Page
     * @param Request $request
     * @return mixed
     */

    public function list(Request $request, $user_id = null, $user_type = null)
    {
        $search = $request->query('search');
        $status = $request->query('status');

        $baseQuery = Booking::with([
            'customer',
            'services',
            'services.service_type',
            'mechanic',
            'garage',
            'vehicle',
            'vehicle.vehile_make',
            'vehicle.vehicle_photos',
            'pickup_address',
            'drop_address',
            'payment',
            'mechanic_job'
        ])
            ->orderBy('created_at', 'DESC')

            ->when($search, function ($q) use ($search) {
                $q->where(function ($q) use ($search) {
                    $q->where('booking_id', 'LIKE', "%{$search}%");
                });
            })

            ->when(!is_null($status), function ($q) use ($status) {
                $q->where('booking_status', $status);
            })

            ->when(!is_null($user_type) && !is_null($user_id), function ($q) use ($user_type, $user_id) {
                if ($user_type === 'customer') {
                    $q->where('user_id', $user_id);
                } elseif ($user_type === 'mechanic') {
                    $q->where('mechanic_id', $user_id);
                }
            });

        $bookings = $baseQuery->paginate($this->per_page ?? 50)->withQueryString();

        $mechanics = User::whereRole('mechanic')
            ->whereStatus(1)
            ->orderBy('name')
            ->select('id', 'name')
            ->get();

        return Inertia::render('SuperAdmin/Bookings/List', [
            'list' => $bookings,
            'search' => $search,
            'status' => $status,
            'mechanics' => $mechanics,
            'user_id' => $user_id,
            'user_type' => $user_type,
        ]);
    }



    /**
     * Assign Mechanic
     * @param Request $request
     * @return mixed
     */
    public function assignMechanic(Request $request)
    {
        $request->validate([
            'garage_id' => 'required|exists:garages,id'
        ]);

        $garage = Garage::with(['mechanic'])->find($request->garage_id);
        if (!$garage) {
            return back()->with('error', "Garage does not exist.");
        }

        $booking = Booking::find($request->booking_id);
        if (!$booking) {
            return back()->with('error', "Booking does not exist.");
        }

        $customer = $booking->customer;
        MechanicJob::create([
            'user_id' => $garage->mechanic->id,
            'booking_id' => $booking->id,
            'status' => 'pending'
        ]);

        $booking->update([
            'garage_id' => $garage->id,
            'booking_status' => 'pending'
        ]);

        if (env("CAN_SEND_MESSAGE")) {
            $templateName = "msg_to_customer_on_assign_mechanic";
            $lang = "en";
            $phone = $customer->phone;
            $data = [
                $customer->name,
            ];
            $perameters = generateParameters($data);
            $msgData = createMessageData($phone, $templateName, $lang, $perameters);
            $fb = new FacebookApi();
            $resp = $fb->sendMessage($msgData);
            createMessageHistory($templateName, $customer, $phone, $resp);
        }

        if (env("CAN_SEND_PUSH_NOTIFICATIONS")) {
            $deviceToken = $customer->fcm_token->token;
            if ($deviceToken) {
                $temp = getNotificationTemplate('mechanic_assigned');
                $uData = [
                    'CUSTOMER_NAME' => $customer->name,
                ];
                $tempWData = parseNotificationTemplate($temp, $uData);
                $data = [
                    'key1' => 'value1',
                    'key2' => 'value2',
                ];
                $resp = $this->sendPushNotification($deviceToken, $tempWData, $data);
                if (!empty($resp) && $resp['name']) {
                    Notification::create([
                        'user_id' => $customer->id,
                        'type' => 'push',
                        'data' => json_encode($tempWData, JSON_UNESCAPED_UNICODE),
                    ]);
                }
            }
        }

        return back()->with('success', 'Mechanic assigned to booking');
    }

    /**
     * Cancel Mechanic Assing Request
     * @param Request $request
     * @return mixed
     */
    public function cancelAssignMechanicRequest(Request $request)
    {
        $job = MechanicJob::find($request->mechanic_job_id);
        if (!$job) {
            return back()->with('error', 'Mechanic job does not exist');
        }

        $booking = Booking::find($request->booking_id);
        if (!$booking) {
            return back()->with('error', 'Booking does not exist');
        }

        $job->update([
            'status' => 'cancelled',
            'cancellation_reason' => $request->reason
        ]);

        $customer = $booking->customer;
        $booking->update([
            'garage_id' => null,
            'booking_status' => 'requested'
        ]);

        if (env("CAN_SEND_MESSAGE")) {
            $templateName = "msg_to_customer_on_booking_cancelled";
            $lang = "en";
            $phone = $customer->phone;
            $data = [
                $customer->name,
                $booking->booking_id,
            ];
            $perameters = generateParameters($data);
            $msgData = createMessageData($phone, $templateName, $lang, $perameters);
            $fb = new FacebookApi();
            $resp = $fb->sendMessage($msgData);
            createMessageHistory($templateName, $customer, $phone, $resp);
        }

        if (env("CAN_SEND_PUSH_NOTIFICATIONS")) {
            $deviceToken = $customer->fcm_token->token;
            if ($deviceToken) {
                $temp = getNotificationTemplate('booking_cancelled');
                $uData = [
                    'CUSTOMER_NAME' => $customer->name,
                    'BOOKING_ID' => $booking->booking_id,
                ];
                $tempWData = parseNotificationTemplate($temp, $uData);
                $data = [
                    'key1' => 'value1',
                    'key2' => 'value2',
                ];
                $resp = $this->sendPushNotification($deviceToken, $tempWData, $data);
                if (!empty($resp) && $resp['name']) {
                    Notification::create([
                        'user_id' => $customer->id,
                        'type' => 'push',
                        'data' => json_encode($tempWData, JSON_UNESCAPED_UNICODE),
                    ]);
                }
            }
        }

        return back()->with('success', 'Assigned mechanic removed');
    }
}
