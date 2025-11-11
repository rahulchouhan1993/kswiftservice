<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Country;
use App\Models\State;
use Exception;
use Illuminate\Http\Request;

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
}
