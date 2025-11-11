<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UserAddress;
use App\Models\Vehicle;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class VehicleController extends Controller
{
    /**
     * Add Vehicle
     * @param Request $request
     * @return mixed
     */
    public function add(Request $request)
    {
        try {
            $rules = [
                'vehicle_type' => [
                    'required',
                    Rule::in(['two_wheeler', 'three_wheeler', 'four_wheeler']),
                ],
                'vehicle_make' => 'required',
                'model' => 'required',
                'year' => 'required',
                'fuel_type' => [
                    'required',
                    Rule::in(['diesel', 'petrol', 'electric', 'hybrid']),
                ],
                'transmission' => [
                    'required',
                    Rule::in(['manual', 'automatic']),
                ],
                'mileage' => 'required',
                'parking_address' => 'required',
                'vehicle_number' => [
                    'required',
                    Rule::unique('vehicles', 'vehicle_number'),
                ],
                'additional_note' => 'required',
            ];

            if ($request->parking_address === 'new_address') {
                $rules['country'] = 'required';
                $rules['state'] = 'required';
                $rules['city'] = 'required';
                $rules['address'] = 'required';
                $rules['pincode'] = 'required';
            } else {
                $rules['country'] = 'required';
                $rules['state'] = 'nullable';
                $rules['city'] = 'nullable';
                $rules['address'] = 'nullable';
                $rules['pincode'] = 'nullable';
            }

            $request->validate($rules);

            $user = $request->user();
            if ($request->parking_address === 'new_address') {
                $address = UserAddress::create([
                    'user_id' => $user->id,
                    'country_id' => $request->country,
                    'state_id' => $request->state,
                    'city_id' => $request->city,
                    'address' => $request->address,
                    'pincode' => $request->pincode,
                ]);
            } else {
                $address = UserAddress::find($request->parking_address);
                if (!$address) {
                    return response()->json([
                        'status' => false,
                        'message' => "Address does not exist",
                    ], 500);
                }
            }

            $vehicle = Vehicle::create([
                'user_id' => $user->id,
                "vehicle_type" => $request->vehicle_type,
                "vehicle_make_id" => $request->vehicle_make,
                "model" => $request->model,
                "vehicle_year" => $request->year,
                "fuel_type" => $request->fuel_type,
                "transmission" => $request->transmission,
                "mileage" => $request->mileage,
                "user_address_id" => $address->id,
                "vehicle_number" => $request->vehicle_number,
                "additional_note" => $request->additional_note,
            ]);

            return response()->json([
                'status' => true,
                'message' => 'Vehicle added successfully.',
                'vehicle' => $vehicle
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }



    /**
     * Update Vehicle
     * @param Request $request
     * @param string $uuid Vehicle UUID
     * @return mixed
     */
    public function update(Request $request, $uuid)
    {
        try {
            $vehicle = Vehicle::firstWhere('uuid', $uuid);
            if (!$vehicle) {
                return response()->json([
                    'status' => false,
                    'message' => 'Vehicle does not exist',
                ], 500);
            }

            $rules = [
                'vehicle_type' => [
                    'required',
                    Rule::in(['two_wheeler', 'three_wheeler', 'four_wheeler']),
                ],
                'vehicle_make' => 'required',
                'model' => 'required',
                'year' => 'required',
                'fuel_type' => [
                    'required',
                    Rule::in(['diesel', 'petrol', 'electric', 'hybrid']),
                ],
                'transmission' => [
                    'required',
                    Rule::in(['manual', 'automatic']),
                ],
                'mileage' => 'required',
                'parking_address' => 'required',
                'vehicle_number' => [
                    'required',
                    Rule::unique('vehicles', 'vehicle_number')->ignore($vehicle),
                ],
                'additional_note' => 'required',
            ];

            if ($request->parking_address === 'new_address') {
                $rules['country'] = 'required';
                $rules['state'] = 'required';
                $rules['city'] = 'required';
                $rules['address'] = 'required';
                $rules['pincode'] = 'required';
            } else {
                $rules['country'] = 'required';
                $rules['state'] = 'nullable';
                $rules['city'] = 'nullable';
                $rules['address'] = 'nullable';
                $rules['pincode'] = 'nullable';
            }

            $request->validate($rules);

            $user = $request->user();
            if ($request->parking_address === 'new_address') {
                $address = UserAddress::create([
                    'user_id' => $user->id,
                    'country_id' => $request->country,
                    'state_id' => $request->state,
                    'city_id' => $request->city,
                    'address' => $request->address,
                    'pincode' => $request->pincode,
                ]);
            } else {
                $address = UserAddress::find($request->parking_address);
                if (!$address) {
                    return response()->json([
                        'status' => false,
                        'message' => "Address does not exist",
                    ], 500);
                }
            }

            $vehicle->update([
                "vehicle_type" => $request->vehicle_type,
                "vehicle_make_id" => $request->vehicle_make,
                "model" => $request->model,
                "vehicle_year" => $request->year,
                "fuel_type" => $request->fuel_type,
                "transmission" => $request->transmission,
                "mileage" => $request->mileage,
                "user_address_id" => $address->id,
                "vehicle_number" => $request->vehicle_number,
                "additional_note" => $request->additional_note,
            ]);

            return response()->json([
                'status' => true,
                'message' => 'Vehicle updated successfully.',
                'vehicle' => $vehicle
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }


    /**
     * Fetch Vehicles List
     * @return mixed
     */
    public function getVehicleList(Request $request)
    {
        try {
            $user = $request->user();
            return $user->vehicles ?? [];
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }


    /**
     * View Vehicle Details
     * @param string $uuid Vehicle UUID
     * @return mixed
     */
    public function viewVehicleDetails($uuid)
    {
        try {
            $vehicle = Vehicle::firstWhere('uuid', $uuid);
            if (!$vehicle) {
                return response()->json([
                    'status' => false,
                    'message' => 'Vehicle does not exist',
                ], 500);
            }

            return response()->json([
                'status' => true,
                'message' => 'Vehicle details fetched.',
                'vehicle' => $vehicle
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }


    /**
     * Update Vehicle Status
     * @param string $uuid Vehicle UUID
     * @param string $status active / inactive
     * @return mixed
     */
    public function updateStatus($uuid, $status)
    {
        try {
            $vehicle = Vehicle::firstWhere('uuid', $uuid);
            if (!$vehicle) {
                return response()->json([
                    'status' => false,
                    'message' => 'Vehicle does not exist',
                ], 500);
            }

            $vehicle->update([
                'status' => $status == 'active' ? 1 : 0
            ]);
            return response()->json([
                'status' => true,
                'message' => 'Vehicle ' . $status . ' succesfully',
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }


    /**
     * Delete Vehicle
     * @param string $uuid Vehicle UUID
     * @return mixed
     */
    public function delete($uuid)
    {
        try {
            $vehicle = Vehicle::firstWhere('uuid', $uuid);
            if (!$vehicle) {
                return response()->json([
                    'status' => false,
                    'message' => 'Vehicle does not exist',
                ], 500);
            }

            $vehicle->delete();
            return response()->json([
                'status' => true,
                'message' => 'Vehicle deleted successfully.',
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
