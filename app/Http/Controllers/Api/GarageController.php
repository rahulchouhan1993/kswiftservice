<?php

namespace App\Http\Controllers\Api;

use App\Helpers;
use App\Http\Controllers\Controller;
use App\Models\Garage;
use App\Models\GaragePhoto;
use App\Models\Vehicle;
use Exception;
use Google\Service\Compute\Resource\GlobalForwardingRules;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Nette\Schema\Expect;

use function App\activityLog;
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
            if ($user->role != 'mechanic') {
                return response()->json([
                    'status' => false,
                    'message' => "Only mechanic can add a garage.",
                ], 500);
            }
            $rules = [
                'name' => [
                    'required',
                    Rule::unique('garages', 'name')->where(fn($query) => $query->where('user_id', $user->id)),
                ],
                'owner_name' => 'required',
                'email' => 'required',
                'phone' => 'required',
                'country' => 'required',
                'state' => 'required',
                'city' => 'required',
                'address' => 'required',
                'pincode' => 'required',
                'bay_count' => 'required',
                'logo' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
                'garage_photos' => 'required|array|min:1',
                'garage_photos.*' => 'image|mimes:jpg,jpeg,png,webp|max:5048',
            ];

            $validated = $request->validate($rules);
            $timings = [
                'monday' => [
                    'status' => $request->monday_status,
                    'timing' => $request->monday_timing,
                ],
                'tuesday' => [
                    'status' => $request->tuesday_status,
                    'timing' => $request->tuesday_timing,
                ],
                'wednesday' => [
                    'status' => $request->wednesday_status,
                    'timing' => $request->wednesday_timing,
                ],
                'thursday' => [
                    'status' => $request->thursday_status,
                    'timing' => $request->thursday_timing,
                ],
                'friday' => [
                    'status' => $request->friday_status,
                    'timing' => $request->friday_timing,
                ],
                'sunday' => [
                    'status' => $request->sunday_status,
                    'timing' => $request->sunday_timing,
                ],
            ];

            $garage = Garage::create([
                'user_id' => $user->id,
                'name' => $validated['name'],
                'owner_name' => $validated['owner_name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'country_id' => $validated['country'],
                'state_id' => $validated['state'],
                'city_id' => $validated['city'],
                'address' => $validated['address'],
                'pincode' => $validated['pincode'],
                'bay_count' => $validated['bay_count'],
                'timings' => $timings,
            ]);

            // Handle photo upload
            if ($request->hasFile('logo')) {
                $photoPath = uploadRequestFile($request, 'logo', $garage, 'garage_photos', 'logo');
                $garage->update(['logo' => $photoPath]);
            }

            if ($request->hasFile('garage_photos')) {
                foreach ($request->file('garage_photos') as $photo) {
                    $fileName = Helpers::shortUuid() . '.' . $photo->getClientOriginalExtension();
                    $photo->storeAs('garage_photos', $fileName, 'public');
                    GaragePhoto::create([
                        'garage_id'    => $garage->id,
                        'photo'      => $fileName,
                    ]);
                }
            }

            foreach ($request->garage_photos as $photo) {
            }

            $garage->load('garage_photos');

            $msg = "garage added by " . $user->name ?? 'user';
            activityLog($user, "garage added", $msg);

            return response()->json([
                'status' => true,
                'message' => 'Garage added successfully.',
                'garage' => $garage
            ]);
        } catch (Exception $e) {
            $msg = "error during garage add - " . $e->getMessage();
            activityLog($request->user(), "error during garage add", $msg);

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
            $user = $request->user();
            if ($user->role != 'mechanic') {
                return response()->json([
                    'status' => false,
                    'message' => "Only mechanic can add a garage.",
                ], 500);
            }

            $garage = Garage::where('uuid', $uuid)->first();
            if (!$garage) {
                return response()->json([
                    'status' => false,
                    'message' => "Garage does not exist.",
                ], 500);
            }

            $rules = [
                'name' => [
                    'required',
                    Rule::unique('garages', 'name')->where(fn($query) => $query->where('user_id', $user->id))->ignore($garage->id),
                ],
                'owner_name' => 'required',
                'email' => 'required',
                'phone' => 'required',
                'country' => 'required',
                'state' => 'required',
                'city' => 'required',
                'address' => 'required',
                'pincode' => 'required',
                'bay_count' => 'required',
                'logo' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
                'garage_photos' => 'nullable|array|min:1',
                'garage_photos.*' => 'image|mimes:jpg,jpeg,png,webp|max:5048',
            ];

            $validated = $request->validate($rules);
            $timings = [
                'monday' => [
                    'status' => $request->monday_status,
                    'timing' => $request->monday_timing,
                ],
                'tuesday' => [
                    'status' => $request->tuesday_status,
                    'timing' => $request->tuesday_timing,
                ],
                'wednesday' => [
                    'status' => $request->wednesday_status,
                    'timing' => $request->wednesday_timing,
                ],
                'thursday' => [
                    'status' => $request->thursday_status,
                    'timing' => $request->thursday_timing,
                ],
                'friday' => [
                    'status' => $request->friday_status,
                    'timing' => $request->friday_timing,
                ],
                'sunday' => [
                    'status' => $request->sunday_status,
                    'timing' => $request->sunday_timing,
                ],
            ];

            $garage->update([
                'name' => $validated['name'],
                'owner_name' => $validated['owner_name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'country_id' => $validated['country'],
                'state_id' => $validated['state'],
                'city_id' => $validated['city'],
                'address' => $validated['address'],
                'pincode' => $validated['pincode'],
                'bay_count' => $validated['bay_count'],
                'timings' => $timings,
            ]);

            // Handle photo upload
            if ($request->hasFile('logo')) {
                $photoPath = uploadRequestFile($request, 'logo', $garage, 'garage_photos', 'logo');
                $garage->update(['logo' => $photoPath]);
            }

            if ($request->hasFile('garage_photos')) {
                foreach ($request->file('garage_photos') as $photo) {
                    $fileName = Helpers::shortUuid() . '.' . $photo->getClientOriginalExtension();
                    $photo->storeAs('garage_photos', $fileName, 'public');

                    GaragePhoto::create([
                        'garage_id' => $garage->id,
                        'photo'     => $fileName,
                    ]);
                }
            }


            $garage->load('garage_photos');

            $msg = $user->name ?? "user" . "updated his garage details";
            activityLog($user, "garage updated succesfully", $msg);

            return response()->json([
                'status' => true,
                'message' => 'Garage updated successfully.',
                'garage' => $garage
            ]);
        } catch (Exception $e) {
            $msg = "error during update garage details - " . $e->getMessage();
            activityLog($request->user(), "error in garage updation", $msg);

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
            if ($user->role != 'mechanic') {
                return response()->json([
                    'status' => false,
                    'message' => "Only mechanic can fetch garage list.",
                ], 500);
            }

            $garage = Garage::with(['garage_photos'])->whereUserId($user->id)->get();
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
    public function viewGarageDetails(Request $request, $uuid)
    {
        try {
            $user = $request->user();
            if ($user->role != 'mechanic') {
                return response()->json([
                    'status' => false,
                    'message' => "Only mechanic can fetch garage details.",
                ], 500);
            }

            $garage = Garage::with(['garage_photos'])->firstWhere('uuid', $uuid);
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
     * @param string $status active / inactive
     * @return mixed
     */
    public function updateStatus(Request $request)
    {
        try {
            $status = $request->status;
            $user = $request->user();
            if ($user->role != 'mechanic') {
                return response()->json([
                    'status' => false,
                    'message' => "Only mechanic can update garage status.",
                ], 500);
            }

            $garage = Garage::latest()->first();
            if (!$garage) {
                return response()->json([
                    'status' => false,
                    'message' => 'Garage does not exist',
                ], 500);
            }

            $garage->update([
                'status' => $status == 'active' ? 1 : 0
            ]);

            $msg = "garage status updated as - " . $garage->status;
            activityLog($user, "garage status updated", $msg);

            return response()->json([
                'status' => true,
                'message' => 'Garage ' . $status . ' succesfully',
            ]);
        } catch (Exception $e) {
            $msg = "error in garage status updation - " . $e->getMessage();
            activityLog($request->user(), "error in garage status updation", $msg);

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
    public function delete(Request $request, $uuid)
    {
        try {
            $user = $request->user();
            $garage = Garage::with('garage_photos')->firstWhere('uuid', $uuid);

            if (!$garage) {
                return response()->json([
                    'status' => false,
                    'message' => 'Garage does not exist',
                ], 404);
            }

            if ($garage->logo) {
                Storage::disk('public')->delete('garage_photos/' . $garage->logo);
            }

            foreach ($garage->garage_photos as $photo) {
                Storage::disk('public')->delete('garage_photos/' . $photo->photo);
            }

            GaragePhoto::where('garage_id', $garage->id)->delete();
            $garage->delete();

            return response()->json([
                'status' => true,
                'message' => 'Garage deleted successfully.',
            ]);
        } catch (Exception $e) {
            $msg = "error in garage deletion - " . $e->getMessage();
            activityLog($request->user(), "error in garage deletion", $msg);

            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }


    /**
     * Delete Garage photo
     * @param string $uuid Garage Photo UUID
     * @return mixed
     */
    public function deleteGaragePhoto(Request $request, $uuid)
    {
        try {
            $user = $request->user();
            if ($user->role != 'mechanic') {
                return response()->json([
                    'status' => false,
                    'message' => "Only mechanic can delete garage.",
                ], 500);
            }

            $garagePhoto = GaragePhoto::firstWhere('uuid', $uuid);

            if (!$garagePhoto) {
                return response()->json([
                    'status' => false,
                    'message' => 'Garage photo does not exist',
                ], 404);
            }

            Storage::disk('public')->delete('garage_photos/' . $garagePhoto->photo);
            $garagePhoto->delete();

            $msg = "garage photo deleted";
            activityLog($user, "garage photo deleted", $msg);

            return response()->json([
                'status' => true,
                'message' => 'Photo deleted successfully.',
            ]);
        } catch (Exception $e) {
            $msg = "error in garage photo deletion - " . $e->getMessage();
            activityLog($request->user(), "error in garage photo deletion", $msg);

            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }


    /**
     * Get Garage Status
     * @return mixed
     */
    public function getGarageStatus(Request $request)
    {
        try {
            $user = $request->user();
            $garage = Garage::whereUserId($user->id)
                ->latest()
                ->select('status')
                ->first();
            if (!$garage) {
                return response()->json([
                    'status' => false,
                    'message' => "Garage does not exist",
                ], 404);
            }
            return response()->json([
                'status' => false,
                'message' => "Garage status fetched succesfully",
                'status' => $garage
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
