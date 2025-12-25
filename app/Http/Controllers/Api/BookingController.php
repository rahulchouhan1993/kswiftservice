<?php

namespace App\Http\Controllers\Api;

use App\FacebookApi;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\BookingService;
use App\Models\Notification;
use App\Models\User;
use App\Models\UserAddress;
use App\Models\Vehicle;
use App\PushNotification;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

use function App\activityLog;
use function App\createMessageData;
use function App\createMessageHistory;
use function App\generateParameters;
use function App\getNotificationTemplate;
use function App\parseNotificationTemplate;
use function App\uploadRequestFile;

class BookingController extends Controller
{
    /**
     * Book Service
     * @param Request $request
     */
    use PushNotification;
    public function bookService(Request $request)
    {
        try {
            $request->validate([
                'vehicle_id' => ['required', 'integer'],
                'services' => ['required', 'array', 'min:1'],
                'services.*' => ['integer', 'exists:service_types,id'],

                'extra_services' => ['nullable', 'array'],
                'extra_services.*' => ['string'],

                'date' => ['required', 'date_format:d-m-Y', 'after_or_equal:today'],
                'time' => ['required', 'date_format:g:i A'],

                'pickup_type' => ['required', Rule::in(['pickup', 'self_drop'])],

                'pickup_address' => [
                    Rule::requiredIf(fn() => $request->pickup_type === 'pickup')
                ],

                'drop_address' => [
                    Rule::requiredIf(fn() => $request->pickup_type === 'pickup')
                ],

                'additional_note' => ['required'],
            ]);

            $user = $request->user();
            $vehicle = Vehicle::where('id', $request->vehicle_id)
                ->where('user_id', $user->id)
                ->first();

            if (!$vehicle) {
                return response()->json([
                    'status' => false,
                    'message' => 'Vehicle does not exist.',
                ], 404);
            }

            // pickup / drop validation
            if ($request->pickup_type === 'pickup') {
                $paddress = UserAddress::where('id', $request->pickup_address)
                    ->where('user_id', $user->id)
                    ->first();

                $daddress = UserAddress::where('id', $request->drop_address)
                    ->where('user_id', $user->id)
                    ->first();

                if (!$paddress) {
                    return response()->json([
                        'status' => false,
                        'message' => 'Pickup address does not exist.',
                    ], 404);
                }

                if (!$daddress) {
                    return response()->json([
                        'status' => false,
                        'message' => 'Drop address does not exist.',
                    ], 404);
                }
            }

            // Create booking
            $booking = Booking::create([
                'user_id' => $user->id,
                'vehicle_id' => $vehicle->id,
                'date' => Carbon::parse($request->date)->format('Y-m-d'),
                'time' => Carbon::parse($request->time)->format('H:i:s'),
                'pickup_type' => $request->pickup_type,
                'additional_note' => $request->additional_note,
                'extra_services' => $request->extra_services,
                'pickup_id' => $request->pickup_type === 'pickup' ? $paddress->id : null,
                'drop_id' => $request->pickup_type === 'pickup' ? $daddress->id : null,
                'booking_status' => 'pending'
            ]);

            // Store services
            foreach ($request->services as $service) {
                BookingService::create([
                    'user_id' => $user->id,
                    'booking_id' => $booking->id,
                    'service_type_id' => $service,
                ]);
            }

            // Load relationships
            $booking->load([
                'customer',
                'mechanic',
                'services.service_type',
                'vehicle',
                'vehicle.vehile_make',
                'vehicle.vehicle_photos',
                'pickup_address',
                'drop_address'
            ]);

            // Format data
            $services = $booking->services->map(function ($service) {
                return [
                    'id' => $service->id,
                    'service_type' => [
                        'id' => $service->service_type->id,
                        'name' => $service->service_type->name,
                        'base_price' => $service->service_type->base_price,
                    ]
                ];
            });

            $vehicleData = [
                'id' => $booking->vehicle->id,
                'vehicle_type' => $booking->vehicle->vehicle_type,
                'vehicle_number' => $booking->vehicle->vehicle_number,
                'model' => $booking->vehicle->model,
                'vehicle_year' => $booking->vehicle->vehicle_year,
                'fuel_type' => $booking->vehicle->fuel_type,
                'transmission' => $booking->vehicle->transmission,
                'mileage' => $booking->vehicle->mileage,
                'additional_note' => $booking->vehicle->additional_note,

                'vehile_make' => [
                    'id' => $booking->vehicle->vehile_make->id,
                    'name' => $booking->vehicle->vehile_make->name,
                    'logo_path' => $booking->vehicle->vehile_make->logo_path,
                ],

                'vehicle_photos' => $booking->vehicle->vehicle_photos->map(function ($photo) {
                    return [
                        'uuid' => $photo->uuid,
                        'photo_url' => $photo->photo_url
                    ];
                })
            ];

            $pickupAddress = $booking->pickup_address ? [
                'id' => $booking->pickup_address->id,
                'address_type' => $booking->pickup_address->address_type,
                'country_id' => $booking->pickup_address->country_id,
                'state_id' => $booking->pickup_address->state_id,
                'city_id' => $booking->pickup_address->city_id,
                'address' => $booking->pickup_address->address,
                'pincode' => $booking->pickup_address->pincode,
                'is_default_address' => $booking->pickup_address->is_default_address,
            ] : null;

            $dropAddress = $booking->drop_address ? [
                'id' => $booking->drop_address->id,
                'address_type' => $booking->drop_address->address_type,
                'country_id' => $booking->drop_address->country_id,
                'state_id' => $booking->drop_address->state_id,
                'city_id' => $booking->drop_address->city_id,
                'address' => $booking->drop_address->address,
                'pincode' => $booking->drop_address->pincode,
                'is_default_address' => $booking->drop_address->is_default_address,
            ] : null;

            $customer = $booking->customer
                ? [
                    'id'   => $booking->customer->id,
                    'name' => $booking->customer->name,
                ]
                : null;


            $mechanic = $booking->mechanic
                ? [
                    'id'   => $booking->mechanic->id,
                    'name' => $booking->mechanic->name,
                ]
                : null;


            $response = [
                'id' => $booking->id,
                'uuid' => $booking->uuid,
                'booking_id' => $booking->booking_id,
                'user_id' => $booking->user_id,
                'vehicle_id' => $booking->vehicle_id,
                'date' => $booking->date,
                'time' => $booking->time,
                'delivery_date' => $booking->delivered_at,
                'assigned_date' => $booking->assigned_date,
                'pickup_type' => $booking->pickup_type,
                'pickup_id' => $booking->pickup_id,
                'drop_id' => $booking->drop_id,
                'additional_note' => $booking->additional_note,
                'extra_services' => $booking->extra_services,
                'created_at' => $booking->created_at,
                'updated_at' => $booking->updated_at,

                'services' => $services,
                'vehicle' => $vehicleData,
                'pickup_address' => $pickupAddress,
                'drop_address' => $dropAddress,

                'customer' => $customer,
                'mechanic' => $mechanic,
            ];

            // WhatsApp message section (unchanged)
            $msg = "service booking for vehicle " . $booking->vehicle->vehicle_number;
            activityLog($user, "service booked", $msg);

            if (env("CAN_SEND_MESSAGE")) {
                $msgUsers = ['admin', 'customer'];
                $lang = "en";
                foreach ($msgUsers as $u) {
                    if ($u == 'admin') {
                        $templateName = "msg_to_customer_on_booking_registered";
                        $phone = env("ADMIN_PHONE");
                        $data = [
                            env("ADMIN_NAME"),
                            $booking->booking_id,
                            $user->name,
                            $user->phone,
                            $booking->booking_id,
                        ];
                    } else {
                        $templateName = "msg_to_customer_on_booking_registered";
                        $phone = $user->phone;
                        $data = [
                            $user->name,
                            $booking->booking_id,
                        ];
                    }
                    $perameters = generateParameters($data);
                    $msgData = createMessageData($phone, $templateName, $lang, $perameters);
                    $fb = new FacebookApi();
                    $resp = $fb->sendMessage($msgData);
                    createMessageHistory($templateName, $user, $phone, $resp);
                }
            }

            if (env("CAN_SEND_PUSH_NOTIFICATIONS")) {
                $deviceToken = $user->fcm_token->token;
                if ($deviceToken) {
                    $temp = getNotificationTemplate('booking_confirmed');
                    $uData = [
                        'CUSTOMER_NAME' => $user->name,
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
                            'user_id' => $user->id,
                            'type' => 'push',
                            'data' => json_encode($tempWData, JSON_UNESCAPED_UNICODE),
                        ]);
                    }
                }
            }

            return response()->json([
                'status' => true,
                'message' => 'Booking request submitted successfully.',
                'booking' => $response
            ]);
        } catch (Exception $e) {
            $msg = "service booking failed due to " . $e->getMessage();
            activityLog($request->user(), "service booking failed", $msg);

            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }




    /**
     * Get Booking Details
     * @param string $uuid UUID Booking UUID
     * @return mixed
     */
    public function getBookingDetails(Request $request, $uuid)
    {
        try {
            $user = $request->user();
            $booking = Booking::with([
                'services',
                'services.service_type',
                'vehicle',
                'vehicle.vehile_make',
                'vehicle.vehicle_photos',
                'pickup_address',
                'drop_address',
                'customer',
                'mechanic',
                'payment',
                'review'
            ])
                ->where('uuid', $uuid)
                ->first();

            if (!$booking) {
                return response()->json([
                    'status' => false,
                    'message' => [],
                ], 404);
            }

            $services = $booking->services->map(function ($service) {
                return [
                    'id' => $service->id,
                    'service_type' => [
                        'id' => $service->service_type->id,
                        'name' => $service->service_type->name,
                        'base_price' => $service->service_type->base_price,
                        'video_url' => $service->video_url,
                        'photo_url' => $service->photo_url,
                        'note' => $service->note,
                    ]
                ];
            });

            $vehicleMake = $booking->vehicle->vehile_make ? [
                'id' => $booking->vehicle->vehile_make->id,
                'name' => $booking->vehicle->vehile_make->name,
                'logo_path' => $booking->vehicle->vehile_make->logo_path,
            ] : null;

            $vehiclePhotos = $booking->vehicle->vehicle_photos->map(function ($photo) {
                return [
                    'uuid' => $photo->uuid,
                    'photo_url' => $photo->photo_url,
                ];
            });

            $vehicle = [
                'id' => $booking->vehicle->id,
                'vehicle_type' => $booking->vehicle->vehicle_type,
                'vehicle_number' => $booking->vehicle->vehicle_number,
                'model' => $booking->vehicle->model,
                'vehicle_year' => $booking->vehicle->vehicle_year,
                'fuel_type' => $booking->vehicle->fuel_type,
                'transmission' => $booking->vehicle->transmission,
                'mileage' => $booking->vehicle->mileage,
                'additional_note' => $booking->vehicle->additional_note,
                'vehile_make' => $vehicleMake,
                'vehicle_photos' => $vehiclePhotos,
            ];

            $pickupAddress = $booking->pickup_address ? [
                'id' => $booking->pickup_address->id,
                'address_type' => $booking->pickup_address->address_type,
                'country_id' => $booking->pickup_address->country_id,
                'state_id' => $booking->pickup_address->state_id,
                'city_id' => $booking->pickup_address->city_id,
                'address' => $booking->pickup_address->address,
                'pincode' => $booking->pickup_address->pincode,
                'is_default_address' => $booking->pickup_address->is_default_address,
            ] : null;

            $dropAddress = $booking->drop_address ? [
                'id' => $booking->drop_address->id,
                'address_type' => $booking->drop_address->address_type,
                'country_id' => $booking->drop_address->country_id,
                'state_id' => $booking->drop_address->state_id,
                'city_id' => $booking->drop_address->city_id,
                'address' => $booking->drop_address->address,
                'pincode' => $booking->drop_address->pincode,
                'is_default_address' => $booking->drop_address->is_default_address,
            ] : null;

            $mechanic = $booking->mechanic ? [
                'id' => $booking->mechanic->id,
                'name' => $booking->mechanic->name,
            ] : null;

            $payment = ($booking->payment && $booking->payment->status == 'success') ? [
                "id" => $booking->payment->id,
                "txnId" => $booking->payment->txnId,
                "amount" => $booking->payment->amount,
                "payment_mode" => $booking->payment->payment_mode,
                "status" => $booking->payment->status,
                "invoice_url" => $booking->payment->invoice_url,
                "received_at" => $booking->payment->received_at,
            ] : null;

            $review = $booking->review ? [
                'review' => $booking->review->review,
                'feedback' => $booking->review->feedback,
            ] : null;

            $response = [
                'id' => $booking->id,
                'uuid' => $booking->uuid,
                'user_id' => $booking->user_id,
                'date' => $booking->date,
                'time' => $booking->time,
                'delivery_date' => $booking->delivered_at,
                'assigned_date' => $booking->assigned_date,
                'pickup_type' => $booking->pickup_type,
                'pickup_id' => $booking->pickup_id,
                'drop_id' => $booking->drop_id,
                'additional_note' => $booking->additional_note,
                'extra_services' => $booking->extra_services,
                'status' => $booking->status,
                'booking_status' => $booking->booking_status,
                'created_at' => $booking->created_at,
                'updated_at' => $booking->updated_at,
                'deleted_at' => $booking->deleted_at,

                'customer' => $booking->customer,
                'mechanic' => $mechanic,

                'services' => $services,
                'vehicle' => $vehicle,
                'pickup_address' => $pickupAddress,
                'drop_address' => $dropAddress,
                'payment' => $payment,
                'review' => $review
            ];

            return response()->json([
                'status' => true,
                'message' => 'Booking details fetched successfully.',
                'booking' => $response,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ]);
        }
    }



    /**
     * Fetch User All Bookings
     * @param string $status Booking Status
     * @return mixed
     */
    public function fetchBookings(Request $request, $status)
    {
        try {
            $user = $request->user();

            $bookings = Booking::with([
                'services.service_type',
                'payment',
                'mechanic',
                'vehicle',
                'vehicle.vehile_make',
                'vehicle.vehicle_photos',
                'pickup_address',
                'drop_address',
                'review'
            ])
                ->whereUserId($user->id)
                ->when($status !== 'all', fn($q) => $q->where('booking_status', $status))
                ->orderBy('id', 'DESC')
                ->get();

            if ($bookings->isEmpty()) {
                return response()->json([
                    'status' => true,
                    'message' => 'No bookings found.',
                ], 201);
            }

            $response = $bookings->map(function ($booking) {

                // Services
                $services = $booking->services->map(function ($service) {
                    return [
                        'id' => $service->id,
                        'service_type' => [
                            'id' => optional($service->service_type)->id,
                            'name' => optional($service->service_type)->name,
                            'base_price' => optional($service->service_type)->base_price,
                        ]
                    ];
                });

                // Vehicle Make
                $vehicleMake = optional($booking->vehicle->vehile_make);
                $vehicleMakeData = $vehicleMake->id ? [
                    'id' => $vehicleMake->id,
                    'name' => $vehicleMake->name,
                    'logo_path' => $vehicleMake->logo_path,
                ] : null;

                // Vehicle Photos
                $vehiclePhotos = optional($booking->vehicle->vehicle_photos)->map(function ($photo) {
                    return [
                        'uuid' => $photo->uuid,
                        'photo_url' => $photo->photo_url,
                    ];
                }) ?? collect([]);

                // Payment
                $paymentModel = optional($booking->payment);
                $payment = ($paymentModel && $paymentModel->status === 'success') ? [
                    "id" => $paymentModel->id,
                    "txnId" => $paymentModel->txnId,
                    "amount" => $paymentModel->amount,
                    "payment_mode" => $paymentModel->payment_mode,
                    "status" => $paymentModel->status,
                    "invoice_url" => $paymentModel->invoice_url,
                    "received_at" => $paymentModel->received_at,
                ] : null;

                // Vehicle
                $vehicleModel = optional($booking->vehicle);
                $vehicle = $vehicleModel->id ? [
                    'id' => $vehicleModel->id,
                    'vehicle_type' => $vehicleModel->vehicle_type,
                    'vehicle_number' => $vehicleModel->vehicle_number,
                    'model' => $vehicleModel->model,
                    'vehicle_year' => $vehicleModel->vehicle_year,
                    'fuel_type' => $vehicleModel->fuel_type,
                    'transmission' => $vehicleModel->transmission,
                    'mileage' => $vehicleModel->mileage,
                    'additional_note' => $vehicleModel->additional_note,
                    'vehile_make' => $vehicleMakeData,
                    'vehicle_photos' => $vehiclePhotos,
                ] : null;

                // Pickup Address
                $pickup = optional($booking->pickup_address);
                $pickupAddress = $pickup->id ? [
                    'id' => $pickup->id,
                    'address_type' => $pickup->address_type,
                    'country_id' => $pickup->country_id,
                    'state_id' => $pickup->state_id,
                    'city_id' => $pickup->city_id,
                    'address' => $pickup->address,
                    'pincode' => $pickup->pincode,
                    'is_default_address' => $pickup->is_default_address,
                ] : null;

                // Drop Address
                $drop = optional($booking->drop_address);
                $dropAddress = $drop->id ? [
                    'id' => $drop->id,
                    'address_type' => $drop->address_type,
                    'country_id' => $drop->country_id,
                    'state_id' => $drop->state_id,
                    'city_id' => $drop->city_id,
                    'address' => $drop->address,
                    'pincode' => $drop->pincode,
                    'is_default_address' => $drop->is_default_address,
                ] : null;

                $mechanic = $booking->mechanic ? [
                    'id' => $booking->mechanic->id,
                    'name' => $booking->mechanic->name,
                ] : null;

                $review = $booking->review ? [
                    'review' => $booking->review->review,
                    'feedback' => $booking->review->feedback,
                ] : null;

                return [
                    'id' => $booking->id,
                    'uuid' => $booking->uuid,
                    'user_id' => $booking->user_id,
                    'vehicle_id' => $booking->vehicle_id,
                    'date' => $booking->date,
                    'time' => $booking->time,
                    'delivery_date' => $booking->delivered_at,
                    'assigned_date' => $booking->assigned_date,
                    'pickup_type' => $booking->pickup_type,
                    'pickup_id' => $booking->pickup_id,
                    'drop_id' => $booking->drop_id,
                    'additional_note' => $booking->additional_note,
                    'extra_services' => $booking->extra_services,
                    'status' => $booking->status,
                    'booking_status' => $booking->booking_status,
                    'created_at' => $booking->created_at,
                    'updated_at' => $booking->updated_at,

                    'services' => $services,
                    'vehicle' => $vehicle,
                    'pickup_address' => $pickupAddress,
                    'drop_address' => $dropAddress,
                    'payment' => $payment,
                    'mechanic' => $mechanic,
                    'review' => $review
                ];
            });

            return response()->json([
                'status' => true,
                'message' => 'Bookings fetched successfully.',
                'bookings' => $response,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ]);
        }
    }




    /**
     * Fetch User Home Page Bookings
     * @param string $status Booking Status
     * @return mixed
     */
    public function getHomePageBooksList(Request $request)
    {
        try {
            $user = $request->user();
            $bookings = Booking::with([
                'services.service_type',
                'vehicle',
                'vehicle.vehile_make',
                'vehicle.vehicle_photos',
                'pickup_address',
                'drop_address',
                'customer',
                'mechanic',
                'review',
                'payment'
            ])
                ->whereUserId($user->id)
                ->orderBy('id', 'DESC')
                ->get()->take(2);


            if ($bookings->isEmpty()) {
                return response()->json([
                    'status' => true,
                    'message' => 'No bookings found.',
                ], 201);
            }

            $response = $bookings->map(function ($booking) {
                $services = $booking->services->map(function ($service) {
                    return [
                        'id' => $service->id,
                        'service_type' => [
                            'id' => $service->service_type->id,
                            'name' => $service->service_type->name,
                            'base_price' => $service->service_type->base_price,
                        ]
                    ];
                });

                $totalSubAmount = $booking->services->sum(function ($service) {
                    return $service->service_type->base_price ?? 0;
                });

                $vehicleMake = $booking->vehicle->vehile_make ? [
                    'id' => $booking->vehicle->vehile_make->id,
                    'name' => $booking->vehicle->vehile_make->name,
                    'logo_path' => $booking->vehicle->vehile_make->logo_path,
                ] : null;

                $vehiclePhotos = $booking->vehicle->vehicle_photos->map(function ($photo) {
                    return [
                        'uuid' => $photo->uuid,
                        'photo_url' => $photo->photo_url,
                    ];
                });

                $review = $booking->review ? [
                    'review' => $booking->review->review,
                    'feedback' => $booking->review->feedback,
                ] : null;

                $vehicle = [
                    'id' => $booking->vehicle->id,
                    'vehicle_type' => $booking->vehicle->vehicle_type,
                    'vehicle_number' => $booking->vehicle->vehicle_number,
                    'model' => $booking->vehicle->model,
                    'vehicle_year' => $booking->vehicle->vehicle_year,
                    'fuel_type' => $booking->vehicle->fuel_type,
                    'transmission' => $booking->vehicle->transmission,
                    'mileage' => $booking->vehicle->mileage,
                    'additional_note' => $booking->vehicle->additional_note,
                    'vehile_make' => $vehicleMake,
                    'vehicle_photos' => $vehiclePhotos,
                ];

                $pickupAddress = $booking->pickup_address ? [
                    'id' => $booking->pickup_address->id,
                    'address_type' => $booking->pickup_address->address_type,
                    'country_id' => $booking->pickup_address->country_id,
                    'state_id' => $booking->pickup_address->state_id,
                    'city_id' => $booking->pickup_address->city_id,
                    'address' => $booking->pickup_address->address,
                    'pincode' => $booking->pickup_address->pincode,
                    'is_default_address' => $booking->pickup_address->is_default_address,
                ] : null;

                $dropAddress = $booking->drop_address ? [
                    'id' => $booking->drop_address->id,
                    'address_type' => $booking->drop_address->address_type,
                    'country_id' => $booking->drop_address->country_id,
                    'state_id' => $booking->drop_address->state_id,
                    'city_id' => $booking->drop_address->city_id,
                    'address' => $booking->drop_address->address,
                    'pincode' => $booking->drop_address->pincode,
                    'is_default_address' => $booking->drop_address->is_default_address,
                ] : null;

                $payment = ($booking->payment && $booking->payment->status == 'success') ? [
                    "id" => $booking->payment->id,
                    "txnId" => $booking->payment->txnId,
                    "amount" => $booking->payment->amount,
                    "payment_mode" => $booking->payment->payment_mode,
                    "status" => $booking->payment->status,
                    "invoice_url" => $booking->payment->invoice_url,
                    "received_at" => $booking->payment->received_at,
                ] : null;

                return [
                    'id' => $booking->id,
                    'uuid' => $booking->uuid,
                    'user_id' => $booking->user_id,
                    'vehicle_id' => $booking->vehicle_id,
                    'date' => $booking->date,
                    'time' => $booking->time,
                    'delivery_date' => $booking->delivered_at,
                    'assigned_date' => $booking->assigned_date,
                    'pickup_type' => $booking->pickup_type,
                    'pickup_id' => $booking->pickup_id,
                    'drop_id' => $booking->drop_id,
                    'additional_note' => $booking->additional_note,
                    'extra_services' => $booking->extra_services,
                    'status' => $booking->status,
                    'booking_status' => $booking->booking_status,
                    'created_at' => $booking->created_at,
                    'updated_at' => $booking->updated_at,

                    'mechanic' => $booking->mechanic,
                    'customer' => $booking->customer,

                    'services' => $services,
                    'total_amount' => $totalSubAmount,

                    'vehicle' => $vehicle,
                    'pickup_address' => $pickupAddress,
                    'drop_address' => $dropAddress,
                    'review' => $review,
                    'payment' => $payment
                ];
            });

            return response()->json([
                'status' => true,
                'message' => 'Bookings fetched successfully.',
                'bookings' => $response,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ]);
        }
    }



    /**
     * Update Booking Status
     * @param Request $request
     * @return mixed
     */
    public function updateBookingStatus(Request $request)
    {
        try {
            $request->validate([
                'booking_id' => [
                    'required'
                ],
                'status' => [
                    'required'
                ],
            ]);

            $user = $request->user();
            $booking = Booking::find($request->booking_id);
            if (!$booking) {
                return response()->json([
                    'status' => false,
                    'message' => "Booking does not exist",
                ], 500);
            }

            $booking->update([
                'booking_status' => $request->status
            ]);

            $msg = "booking status updated at " . $booking->status;
            activityLog($user, "booking status updated", $msg);

            return response()->json([
                'status' => true,
                'message' => "Booking status updated as " . $request->status,
                'booking' => $booking
            ], 201);
        } catch (Exception $e) {
            $msg = "booking status updation error due to " . $e->getMessage();
            activityLog($request->user(), "booking status updation error", $msg);

            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }



    /**
     * Upload Booking Service Video Or Photo
     * @param Request $request
     * @return mixed
     */
    public function uploadBookingVideos(Request $request)
    {
        try {

            $user = $request->user();
            if ($user->role != 'mechanic') {
                return response()->json([
                    'status' => false,
                    'message' => "Only mechnaic can upload service videos or photos.",
                ], 500);
            }
            $request->validate([
                'customer_id' => [
                    'required',
                    Rule::exists('users', 'id')->where(fn($q) => $q->where('role', 'customer')),
                ],

                'service_id' => [
                    'required',
                    Rule::exists('booking_services', 'id'),
                ],

                'note' => [
                    'nullable',
                ],

                'file' => [
                    'required',
                    'file',
                    'max:10240',
                    'mimetypes:image/jpeg,image/png,image/jpg,video/mp4,video/quicktime,video/x-msvideo'
                ],
            ]);

            $customer = User::find($request->customer_id);
            if (!$customer) {
                return response()->json([
                    'status' => false,
                    'message' => "Customer does not exist",
                ], 404);
            }

            $service = BookingService::with(['service_type'])->find($request->service_id);
            if (!$service) {
                return response()->json([
                    'status' => false,
                    'message' => "Service does not exist",
                ], 404);
            }

            $fileType = null;
            if ($request->hasFile('file')) {

                $mime = $request->file('file')->getMimeType();
                if (str_contains($mime, 'image')) {
                    $fileType = 'Image';
                    uploadRequestFile($request, 'file', $service, 'service_photos', 'photo_path');
                }

                if (str_contains($mime, 'video')) {
                    $fileType = 'Video';
                    uploadRequestFile($request, 'file', $service, 'service_videos', 'video_path');
                }
            }

            $service->update([
                'note' => $request->note
            ]);

            $data = [
                'service_title' => $service->service_type->name,
                'photo_url' => $service->photo_url,
                'video_url' => $service->video_url,
                'note' => $service->note,
            ];

            $msg = "service (" . $data['service_title'] . ") proof uploaded by mechanic";
            activityLog($user, "service proof uploaded", $msg);

            if (env("CAN_SEND_MESSAGE")) {
                $templateName = "msg_to_customer_on_upload_service_proof";
                $lang = "en";
                $phone = $customer->phone;
                $pdata = [
                    $customer->name,
                    $fileType,
                    $service->service_type->name
                ];
                $perameters = generateParameters($pdata);
                $msgData = createMessageData($phone, $templateName, $lang, $perameters);
                $fb = new FacebookApi();
                $resp = $fb->sendMessage($msgData);
                createMessageHistory($templateName, $customer, $phone, $resp);
            }

            if (env("CAN_SEND_PUSH_NOTIFICATIONS")) {
                $deviceToken = $customer->fcm_token->token;
                if ($deviceToken) {
                    $temp = getNotificationTemplate('video_uploaded');
                    $uData = [
                        'CUSTOMER_NAME' => $customer->name,
                        'SERVICE_NAME' => $service->service_type->name
                    ];
                    $tempWData = parseNotificationTemplate($temp, $uData);
                    $mdata = [
                        'key1' => 'value1',
                        'key2' => 'value2',
                    ];
                    $resp = $this->sendPushNotification($deviceToken, $tempWData, $mdata);
                    if (!empty($resp) && $resp['name']) {
                        Notification::create([
                            'user_id' => $customer->id,
                            'type' => 'push',
                            'data' => json_encode($tempWData, JSON_UNESCAPED_UNICODE),
                        ]);
                    }
                }
            }

            return response()->json([
                'status' => true,
                'message' => "File uploaded successfully",
                'service' => $data
            ]);
        } catch (Exception $e) {
            $msg = "service proof uploaded by mechanic failed due to " . $e->getMessage();
            activityLog($request->user(), "service proof uploaded", $msg);

            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }


    /**
     * Fetch Services Videos Or Photos
     * @param string $uuid Booking UUID
     * @param Request $request
     * @return mixed
     */
    public function fetchServicesVideos(Request $request, $uuid)
    {
        try {
            $user = $request->user();
            $booking = Booking::with([
                'services.service_type',
                'mechanic',
                'vehicle',
                'vehicle.vehicle_photos',
                'payment'
            ])
                ->where('uuid', $uuid)
                ->first();

            if (!$booking) {
                return response()->json([
                    'status' => false,
                    'message' => 'Booking not found'
                ], 404);
            }

            // Format services
            $services = $booking->services->map(function ($service) {
                return [
                    'service_type_name' => $service->service_type->name ?? null,
                    'photo_url' => $service->photo_url,
                    'video_url' => $service->video_url,
                ];
            });

            // Format vehicle photos
            $vehiclePhotos = $booking->vehicle->vehicle_photos->map(function ($p) {
                return $p->photo_url;
            });

            return response()->json([
                'status' => true,
                'message' => "Booking data fetched",
                'data' => [
                    'booking_id' => $booking->booking_id,
                    'date' => $booking->date,
                    'time' => $booking->time,

                    // NEW FIELDS
                    'mechanic_name' => $booking->mechanic->name ?? null,
                    'vehicle_number' => $booking->vehicle->vehicle_number ?? null,
                    'vehicle_photos' => $vehiclePhotos,
                    'services' => $services,
                    'invoice_url' => $booking->payment->invoice_url,
                ],
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }



    /**
     * Upload Booking Delivery Timings
     * @param Request $request
     * @return mixed
     */
    public function updateBookingDeliveryTimeing(Request $request)
    {
        try {
            $user = $request->user();
            if ($user->role != 'mechanic') {
                return response()->json([
                    'status' => false,
                    'message' => "Only mechnaic can update booking delivery timings",
                ], 500);
            }

            $request->validate([
                'uuid' => [
                    'required',
                    Rule::exists('bookings', 'uuid'),
                ],

                'date_time' => [
                    'required',
                ]
            ]);

            $booking = Booking::firstWhere('uuid', $request->uuid);
            if (!$booking) {
                return response()->json([
                    'status' => false,
                    'message' => "Booking does not exist",
                ], 500);
            }
            $booking->update([
                'delivery_date' => $request->date_time
            ]);

            $msg = "Mechanic update delivery time for booking " . $booking->booking_id;
            activityLog($user, "Booking delivery date time updated", $msg);

            return response()->json([
                'status' => true,
                'message' => "Booking delivery date & time updated.",
            ]);
        } catch (Exception $e) {
            $msg = "error during update booking delivery date & time " . $e->getMessage();
            activityLog($request->user(), "error in booking delivery date time updation", $msg);

            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
