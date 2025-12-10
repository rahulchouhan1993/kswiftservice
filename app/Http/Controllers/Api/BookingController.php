<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\BookingService;
use App\Models\User;
use App\Models\UserAddress;
use App\Models\Vehicle;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

use function App\activityLog;
use function App\uploadRequestFile;

class BookingController extends Controller
{
    /**
     * Book Service
     * @param Request $request
     */
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
            $vehicle = Vehicle::find($request->vehicle_id)
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
                $paddress = UserAddress::find($request->pickup_address);
                $daddress = UserAddress::find($request->drop_address);

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

            // create booking
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
            ]);

            // store services
            foreach ($request->services as $service) {
                BookingService::create([
                    'user_id' => $user->id,
                    'booking_id' => $booking->id,
                    'service_type_id' => $service,
                ]);
            }

            // load relationships
            $booking->load([
                'services.service_type',
                'vehicle',
                'vehicle.vehile_make',
                'vehicle.vehicle_photos'
            ]);

            if ($booking->pickup_id) {
                $booking->load([
                    'pickup_address',
                ]);
            }

            if ($booking->drop_id) {
                $booking->load([
                    'drop_address',
                ]);
            }

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

            $response = [
                'id' => $booking->id,
                'uuid' => $booking->uuid,
                'booking_id' => $booking->booking_id,
                'user_id' => $booking->user_id,
                'vehicle_id' => $booking->vehicle_id,
                'date' => $booking->date,
                'time' => $booking->time,
                'pickup_type' => $booking->pickup_type,
                'pickup_id' => $booking->pickup_id,
                'drop_id' => $booking->drop_id,
                'additional_note' => $booking->additional_note,
                'extra_services' => $booking->extra_services,
                'created_at' => $booking->created_at,
                'updated_at' => $booking->updated_at,

                'services' => $services,
                'vehicle' => $vehicle,
                'pickup_address' => $pickupAddress,
                'drop_address' => $dropAddress,
            ];

            $msg = "service booking for vehicle " . $booking->vehicle->vehicle_number;
            activityLog($user, "service booked", $msg);

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
                'services.service_type',
                'vehicle',
                'vehicle.vehile_make',
                'vehicle.vehicle_photos',
                'pickup_address',
                'drop_address',
                'customer',
                'mechanic',
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

            $response = [
                'id' => $booking->id,
                'uuid' => $booking->uuid,
                'user_id' => $booking->user_id,
                'date' => $booking->date,
                'time' => $booking->time,
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
                'mechanic' => $booking->mechanic,

                'services' => $services,
                'vehicle' => $vehicle,
                'pickup_address' => $pickupAddress,
                'drop_address' => $dropAddress,
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
                'vehicle',
                'vehicle.vehile_make',
                'vehicle.vehicle_photos',
                'pickup_address',
                'drop_address'
            ])
                ->whereUserId($user->id)
                ->when($status !== 'all', function ($query) use ($status) {
                    return $query->where('booking_status', $status);
                })
                ->orderBy('id', 'DESC')
                ->get();


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

                return [
                    'id' => $booking->id,
                    'uuid' => $booking->uuid,
                    'user_id' => $booking->user_id,
                    'vehicle_id' => $booking->vehicle_id,
                    'date' => $booking->date,
                    'time' => $booking->time,
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
                'message' => $e->getMessage()
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
                'mechanic'
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

                return [
                    'id' => $booking->id,
                    'uuid' => $booking->uuid,
                    'user_id' => $booking->user_id,
                    'vehicle_id' => $booking->vehicle_id,
                    'date' => $booking->date,
                    'time' => $booking->time,
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

            if ($request->hasFile('file')) {

                $mime = $request->file('file')->getMimeType();
                if (str_contains($mime, 'image')) {
                    uploadRequestFile($request, 'file', $service, 'service_photos', 'photo_path');
                }

                if (str_contains($mime, 'video')) {
                    uploadRequestFile($request, 'file', $service, 'service_videos', 'video_path');
                }
            }

            $data = [
                'service_title' => $service->service_type->name,
                'photo_url' => $service->photo_url,
                'video_url' => $service->video_url
            ];

            $msg = "service (" . $data['service_title'] . ") proof uploaded by mechanic";
            activityLog($user, "service proof uploaded", $msg);

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
}
