<?php

namespace App\Http\Controllers\Api;

use App\Helpers;
use App\Http\Controllers\Controller;
use App\Models\UserAddress;
use App\Models\Vehicle;
use App\Models\VehiclePhoto;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

use function App\uploadRequestFile;

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
                'vehicle_number' => [
                    'required',
                    Rule::unique('vehicles', 'vehicle_number'),
                ],
                'additional_note' => 'required',
                'vehicle_photos' => 'required|array|min:1',
                'vehicle_photos.*' => 'image|mimes:jpg,jpeg,png,webp|max:5048',
            ];

            $request->validate($rules);

            $user = $request->user();

            $vehicle = Vehicle::create([
                'user_id' => $user->id,
                "vehicle_type" => $request->vehicle_type,
                "vehicle_make_id" => $request->vehicle_make,
                "model" => $request->model,
                "vehicle_year" => $request->year,
                "fuel_type" => $request->fuel_type,
                "transmission" => $request->transmission,
                "mileage" => $request->mileage,
                "vehicle_number" => $request->vehicle_number,
                "additional_note" => $request->additional_note,
            ]);

            foreach ($request->vehicle_photos as $photo) {
                $fileName = Helpers::shortUuid() . '.' . $photo->getClientOriginalExtension();
                $photo->storeAs('vehicle_photos', $fileName, 'public');
                VehiclePhoto::create([
                    'user_id'    => $user->id,
                    'vehicle_id' => $vehicle->id,
                    'photo'      => $fileName,
                ]);
            }

            $vehicle->load('vehicle_photos');
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
            $vehicle = Vehicle::where('uuid', $uuid)->first();
            if (!$vehicle) {
                return response()->json([
                    'status' => false,
                    'message' => "Vehicle does not exist",
                ], 404);
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
                'vehicle_number' => [
                    'required',
                    Rule::unique('vehicles', 'vehicle_number')->ignore($vehicle->id),
                ],
                'additional_note' => 'required',
                'vehicle_photos' => 'nullable|array|min:0',
                'vehicle_photos.*' => 'image|mimes:jpg,jpeg,png,webp|max:5048',
            ];

            $request->validate($rules);
            $user = $request->user();

            // Update vehicle
            $vehicle->update([
                "vehicle_type" => $request->vehicle_type,
                "vehicle_make_id" => $request->vehicle_make,
                "model" => $request->model,
                "vehicle_year" => $request->year,
                "fuel_type" => $request->fuel_type,
                "transmission" => $request->transmission,
                "mileage" => $request->mileage,
                "vehicle_number" => $request->vehicle_number,
                "additional_note" => $request->additional_note,
            ]);

            if ($request->has('vehicle_photos')) {

                // 1. Delete old photos from storage
                foreach ($vehicle->vehicle_photos as $oldPhoto) {
                    Storage::disk('public')->delete('vehicle_photos/' . $oldPhoto->photo);
                }

                // 2. Delete from DB
                VehiclePhoto::where('vehicle_id', $vehicle->id)->delete();

                // 3. Upload new photos
                foreach ($request->vehicle_photos as $photo) {
                    $fileName = Helpers::shortUuid() . '.' . $photo->getClientOriginalExtension();
                    $photo->storeAs('vehicle_photos', $fileName, 'public');

                    VehiclePhoto::create([
                        'user_id'    => $user->id,
                        'vehicle_id' => $vehicle->id,
                        'photo'      => $fileName,
                    ]);
                }
            }

            $vehicle->load('vehicle_photos');

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
            $vehicles = Vehicle::with(['vehicle_photos'])->whereUserId($user->id)->get();

            return response()->json([
                'status' => true,
                'message' => "Vehicle list fetched succesfully",
                'vehicles' => $vehicles
            ], 201);
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
            $vehicle = Vehicle::with(['vehicle_photos'])->firstWhere('uuid', $uuid);
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
            $vehicle = Vehicle::with('vehicle_photos')->firstWhere('uuid', $uuid);

            if (!$vehicle) {
                return response()->json([
                    'status' => false,
                    'message' => 'Vehicle does not exist',
                ], 404);
            }

            foreach ($vehicle->vehicle_photos as $photo) {
                Storage::disk('public')->delete('vehicle_photos/' . $photo->photo);
            }

            VehiclePhoto::where('vehicle_id', $vehicle->id)->delete();
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
