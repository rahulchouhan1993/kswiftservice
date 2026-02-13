<?php

namespace App\Http\Controllers\SuperAdmin;

use App\FacebookApi;
use App\Helpers;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\BookingAcceptRequest;
use App\Models\BookingRequest;
use App\Models\Garage;
use App\Models\MechanicJob;
use App\Models\Notification;
use App\Models\User;
use App\PushNotification;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Inertia\Inertia;

use function App\activityLog;
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

        $role = null;
        if ($user_id) {
            $user = User::find($user_id);
            $role = $user->role;
        }

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
            'mechanic_job',
            'rejected_mechanic_job',
            'rejected_mechanic_job.mechanic',
            'review'
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
            'role' => $role
        ]);
    }



    /**
     * Assign Mechanic
     * @param Request $request
     * @return mixed
     */
    public function assignMechanic(Request $request)
    {
        try {
            $accepted_by = $request->accepted_by ?? null;
            $bRequest = null;
            if($accepted_by == 'admin'){
                $bRequest = BookingRequest::where('uuid',$request->uuid)->first();
                if(!$bRequest){
                    return back()->with('error', "Booking request does not exist.");
                }
            }
            $request->validate([
                'garage_id' => 'required|exists:garages,id'
            ]);

            $garage = Garage::with(['mechanic'])->find($request->garage_id);
            if (!$garage) {
                return back()->with('error', "Garage does not exist.");
            }

            if (empty($garage->mechanic)) {
                return back()->with('error', "Garage mechanic does not exist.");
            }

            $booking = Booking::find($request->booking_id);
            if (!$booking) {
                return back()->with('error', "Booking does not exist.");
            }

            if(!empty($booking->mechanic_id)){
                return back()->with('error', "Booking mechanic already assigned.");
            }

            $customer = $booking->customer;
            $job = MechanicJob::create([
                'user_id' => $garage->mechanic->id,
                'booking_id' => $booking->id,
                'status' => $accepted_by === 'admin' ? 'accepted' : 'pending'
            ]);

            $booking->update([
                'garage_id' => $garage->id,
                'booking_status' => 'awaiting_acceptance'
            ]);

            if($accepted_by == 'admin' ){
                $booking->update([
                    'mechanic_id'   => $garage->mechanic->id,
                    'booking_status' => 'awaiting_payment',
                    'assigned_date' => Carbon::now(),
                ]);

                $bRequest->update([
                    'note' => $request->note ?? null,
                    'admin_status' => 'accepted',
                    'mechanic_status' => 'accepted',
                ]);
            }

            $phone = $customer->phone;
            if (env("CAN_SEND_MESSAGE") && empty($accepted_by)) {
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

            if (env("CAN_SEND_MESSAGE") && $garage?->mechanic?->id && empty($accepted_by)) {
                $mechanic     = $garage->mechanic;
                $vehicle      = $booking->vehicle;
                $vehicleMake  = $vehicle?->vehile_make;

                $templateName = "msg_to_mechanic_on_new_job_assigned";
                $lang         = "en";
                $phone        = $mechanic->phone;

                $serviceNames = $booking->services
                    ->pluck('service_type.name')
                    ->filter()
                    ->implode(', ');

                $data = [
                    $mechanic->name ?? '',
                    trim(($vehicleMake?->name ?? '') . ($vehicle?->model ? ' & ' . $vehicle->model : '')),
                    $vehicle?->vehicle_number ?? '',
                    $serviceNames,
                ];

                $parameters = generateParameters($data);
                $msgData = createMessageData($phone, $templateName, $lang, $parameters);

                $fb   = new FacebookApi();
                $resp = $fb->sendMessage($msgData);

                createMessageHistory($templateName, $mechanic, $phone, $resp);
            }

            if($accepted_by == 'admin'){
                if (env('CAN_SEND_MESSAGE')) {
                    $templateName = 'msg_to_customer_on_adnavce_payment';
                    $params = [
                        $booking->customer->name,
                        Helpers::toRupeeCurrency(1000),
                    ];

                    $msgData = createMessageData(
                        $booking->customer->phone,
                        $templateName,
                        'en',
                        generateParameters($params)
                    );

                    $fb = new FacebookApi();
                    $resp = $fb->sendMessage($msgData);
                    createMessageHistory($templateName, $booking->customer, $booking->customer->phone, $resp);
                }
            }


            if (env("CAN_SEND_PUSH_NOTIFICATIONS")) {
                $deviceToken = $customer->fcm_token ? $customer->fcm_token->token : null;
                if ($deviceToken) {
                    $temp = getNotificationTemplate('mechanic_assigned');
                    $uData = [
                        'CUSTOMER_NAME' => $customer->name,
                    ];
                    $tempWData = parseNotificationTemplate($temp, $uData);
                    $data = [
                        'type'          => 'mechanic_assigned',
                        'booking_uuid'  => (string) $booking->uuid,
                        'hasReview'     => $booking->review ? '1' : '0',
                        'msg_type' => 'booking'
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


            if (env("CAN_SEND_PUSH_NOTIFICATIONS") && $garage?->mechanic?->id) {
                $mechanic     = $garage->mechanic;
                $deviceToken = $mechanic->fcm_token ? $mechanic->fcm_token->token : null;
                if ($deviceToken) {
                    $temp = getNotificationTemplate('mechanic_new_job_assigned');
                    $uData = [
                        'MECHANIC_NAME' => $mechanic->name,
                    ];
                    $tempWData = parseNotificationTemplate($temp, $uData);
                    $data = [
                        'type'          => 'mechanic_new_job_assigned',
                        'booking_uuid'  => (string) $booking->uuid,
                        'job_uuid'     => $job->uuid,
                        'msg_type' => 'booking'
                    ];
                    $resp = $this->sendPushNotification($deviceToken, $tempWData, $data);
                    if (!empty($resp) && $resp['name']) {
                        Notification::create([
                            'user_id' => $mechanic->id,
                            'type' => 'push',
                            'data' => json_encode($tempWData, JSON_UNESCAPED_UNICODE),
                        ]);
                    }
                }
            }

            return back()->with('success', 'Mechanic assigned to booking');
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
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
            'booking_status' => 'pending'
        ]);

        $phone = $customer->phone;
        if (env("CAN_SEND_MESSAGE" && !empty($phone))) {
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
            $deviceToken = $customer->fcm_token ? $customer->fcm_token->token : null;
            if ($deviceToken) {
                $temp = getNotificationTemplate('booking_cancelled');
                $uData = [
                    'CUSTOMER_NAME' => $customer->name,
                    'BOOKING_ID' => $booking->booking_id,
                ];
                $tempWData = parseNotificationTemplate($temp, $uData);
                $data = [
                    'type'          => 'booking_cancelled',
                    'booking_uuid'  => (string) $booking->uuid,
                    'hasReview'     => $booking->review ? '1' : '0',
                    'msg_type' => 'booking'
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


    /**
     * Get Booking Requests
     * @param Request $request
     * @return mixed
     */
    public function bookingRequests(Request $request, $uuid)
    {
        $search = $request->query('search');
        $status = $request->query('status');

        $booking = Booking::where('uuid', $uuid)->first();
        if (!$booking) {
            return back()->with('error', 'Booking does not exist');
        }

        $baseQuery = BookingRequest::with([
            'user',
            'mechanic',
            'mechanic.latest_garage',
            'booking',
            'booking.vehicle',
            'booking.vehicle.vehile_make',
        ])
        ->where('booking_id', $booking->id)
        ->when(filled($search), function ($q) use ($search) {
            $q->where(function ($inner) use ($search) {
                $inner->whereHas('booking', function ($qb) use ($search) {
                    $qb->where('booking_id', 'LIKE', "%{$search}%");
                })
                ->orWhereHas('mechanic', function ($qm) use ($search) {
                    $qm->where('name', 'LIKE', "%{$search}%")
                        ->orWhere('email', 'LIKE', "%{$search}%")
                        ->orWhere('phone', 'LIKE', "%{$search}%");
                });
            });
        })
            ->when(filled($status), function ($q) use ($status) {
                $q->where('mechanic_status', $status);
            });

        $requests = (clone $baseQuery)->paginate($this->per_page ?? 50)->withQueryString();
        return Inertia::render('SuperAdmin/Bookings/BookingRequestList', [
            'list' => $requests,
            'booking' => $booking,
            'search' => $search,
            'status' => $status,
        ]);
    }
}
