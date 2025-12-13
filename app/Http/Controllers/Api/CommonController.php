<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Country;
use App\Models\ServiceType;
use App\Models\State;
use App\Models\VehicleMake;
use Exception;
use Illuminate\Http\Request;

use function App\activityLog;

class CommonController extends Controller
{
    /**
     * Get All Countries List
     * @return mixed
     */
    public function getAllCountries()
    {
        try {
            $countiries = Country::whereStatus(1)->orderBy('name')->get()->toArray();
            return response()->json([
                'status' => true,
                'message' => 'Countiries list fetched',
                'list' => $countiries
            ], 500);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get Country, States List
     * @param int $country_id Country Id
     * @return mixed
     */
    public function getCountryStates($country_id)
    {
        try {
            $country = Country::find($country_id);
            if (!$country) {
                return response()->json([
                    'status' => false,
                    'message' => "Country does not exist",
                ], 500);
            }

            $states = $country->states;

            return response()->json([
                'status' => true,
                'message' => 'States list fetched',
                'list' => $states
            ], 500);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }


    /**
     * Get State, Cities List
     * @param int $state_id State Id
     * @return mixed
     */
    public function getStateCities($state_id)
    {
        try {
            $state = State::find($state_id);
            if (!$state) {
                return response()->json([
                    'status' => false,
                    'message' => "State does not exist",
                ], 500);
            }

            $cities = $state->cities;

            return response()->json([
                'status' => true,
                'message' => 'Cities list fetched',
                'list' => $cities
            ], 500);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }



    /**
     * Get All Vehile Males List
     * @return mixed
     */
    public function getVehicleMakes(Request $request)
    {
        try {
            $makes = VehicleMake::select('id', 'uuid', 'name', 'vehicle_type', 'logo_path')
                ->whereStatus(1)
                ->when($request->filled('vehicle_type'), function ($query) use ($request) {
                    $query->where('vehicle_type', $request->vehicle_type);
                })
                ->orderBy('name')
                ->get();

            return response()->json([
                'status'  => true,
                'message' => 'Vehicle makes list fetched',
                'list'    => $makes,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }


    /**
     * Get All Vehicles List for a Vehicle Make
     * @param string $uuid Vehicle Make UUID
     * @return mixed
     */
    public function getVehicleMakeAllVehiclesList($uuid)
    {
        try {
            $make = VehicleMake::with([
                'vehicles',
                'vehicles.vehicle_photos'
            ])
                ->where('uuid', $uuid)
                ->first();

            if (!$make) {
                return response()->json([
                    'status' => false,
                    'message' => 'Vehicle make not found',
                ], 404);
            }

            return response()->json([
                'status' => true,
                'message' => 'Vehicle make vehicles list fetched',
                'list' => $make
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }


    /**
     * Fetch Services List
     * @return mixed
     */
    public function getServicesList(Request $request)
    {
        try {
            $services = ServiceType::select('id', 'name', 'base_price', 'vehicle_type')
                ->whereStatus(1)
                ->when($request->filled('vehicle_type'), function ($query) use ($request) {
                    $query->where('vehicle_type', $request->vehicle_type);
                })
                ->orderBy('name')
                ->get()
                ->toArray();

            return response()->json([
                'status'  => true,
                'message' => 'Services list fetched',
                'list'    => $services
            ], 200);
        } catch (Exception $e) {

            return response()->json([
                'status'  => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
