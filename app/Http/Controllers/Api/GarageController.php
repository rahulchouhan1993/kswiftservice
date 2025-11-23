<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Garage;
use App\Models\Vehicle;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

use function App\uploadRequestFile;

class GarageController extends Controller
{
    /**
     * Add Garage
     * @param Request $request
     * @return mixed
     */
    public function add(Request $request)
    {
        try {
            $user = $request->user();
            $rules = [
                'name' => [
                    'required',
                    Rule::unique('garages', 'name')->where(fn($query) => $query->where('user_id', $user->id)),
                ],
                'email' => 'nullable',
                'phone' => 'nullable',
                'country' => 'required',
                'state' => 'required',
                'city' => 'required',
                'address' => 'required',
                'pincode' => 'required',
                'garage_photo' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            ];

            $validated = $request->validate($rules);
            $garage = Garage::create([
                'user_id' => $user->id,
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'country_id' => $validated['country'],
                'state_id' => $validated['state'],
                'city_id' => $validated['city'],
                'address' => $validated['address'],
                'pincode' => $validated['pincode'],
            ]);

            // Handle photo upload
            if ($request->hasFile('garage_photo')) {
                $photoPath = uploadRequestFile($request, 'garage_photo', $garage, 'garage_photos', 'photo');
                $garage->update(['photo' => $photoPath]);
            }

            return response()->json([
                'status' => true,
                'message' => 'Garage added successfully.',
                'garage' => $garage,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }




    /**
     * Update Garage
     * @param Request $request
     * @param string $uuid Garage UUID
     * @return mixed
     */
    public function update(Request $request, $uuid)
    {
        try {
            $garage = Garage::where('uuid', $uuid)->first();
            if (!$garage) {
                return response()->json([
                    'status' => false,
                    'message' => "Garage does not exist",
                ], 404);
            }

            $rules = [
                'name' => [
                    'required',
                    Rule::unique('garages', 'name')->ignore($garage->id),
                ],
                'email' => 'nullable|email',
                'phone' => 'nullable',
                'country' => 'required',
                'state' => 'required',
                'city' => 'required',
                'address' => 'required',
                'pincode' => 'required',
                'garage_photo' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            ];

            $validated = $request->validate($rules);

            $garage->update([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'country' => $validated['country'],
                'state' => $validated['state'],
                'city' => $validated['city'],
                'address' => $validated['address'],
                'pincode' => $validated['pincode'],
            ]);

            if ($request->hasFile('garage_photo')) {
                $photoPath = uploadRequestFile($request, 'garage_photo', $garage, 'garage_photos', 'photo');
                $garage->update(['photo' => $photoPath]);
            }


            return response()->json([
                'status' => true,
                'message' => 'Garage updated successfully.',
                'vehicle' => $garage
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }


    /**
     * Fetch Garage List
     * @return mixed
     */
    public function getGarageList(Request $request)
    {
        try {
            $user = $request->user();
            $garage = Garage::whereUserId($user->id)->get();

            return response()->json([
                'status' => true,
                'message' => "Garage list fetched succesfully",
                'garage' => $garage
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }


    /**
     * View Garage Details
     * @param string $uuid Garage UUID
     * @return mixed
     */
    public function viewGarageDetails($uuid)
    {
        try {
            $garage = Garage::firstWhere('uuid', $uuid);
            if (!$garage) {
                return response()->json([
                    'status' => false,
                    'message' => 'Garage does not exist',
                ], 500);
            }

            return response()->json([
                'status' => true,
                'message' => 'Garage details fetched.',
                'garage' => $garage
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }


    /**
     * Update Garage Status
     * @param string $uuid Garage UUID
     * @param string $status active / inactive
     * @return mixed
     */
    public function updateStatus($uuid, $status)
    {
        try {
            $garage = Garage::firstWhere('uuid', $uuid);
            if (!$garage) {
                return response()->json([
                    'status' => false,
                    'message' => 'Garage does not exist',
                ], 500);
            }

            $garage->update([
                'status' => $status == 'active' ? 1 : 0
            ]);
            return response()->json([
                'status' => true,
                'message' => 'Garage ' . $status . ' succesfully',
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }


    /**
     * Delete Garage
     * @param string $uuid Garage UUID
     * @return mixed
     */
    public function delete($uuid)
    {
        try {
            $garage = Garage::firstWhere('uuid', $uuid);

            if (!$garage) {
                return response()->json([
                    'status' => false,
                    'message' => 'Garage does not exist',
                ], 404);
            }

            Storage::disk('public')->delete('garage_photos/' . $garage->photo);
            $garage->delete();

            return response()->json([
                'status' => true,
                'message' => 'Garage deleted successfully.',
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
