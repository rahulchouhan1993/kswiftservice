<?php

namespace App\Http\Controllers;

use App\Models\Garage;
use App\Models\User;
use Illuminate\Http\Request;

class CommonController extends Controller
{
    /**
     * Search Garages
     * @param Request $request
     * @return mixed
     */
    public function serachGarages(Request $request)
    {
        $pincode = $request->pincode;
        $type = $request->type;

        $garages = Garage::query()
            ->whereStatus(1)
            ->when($type !== 'all', function ($q) use ($pincode) {
                if ($pincode) {
                    $q->where('pincode', $pincode);
                }
            })
            ->get();

        return response()->json([
            'garages' => $garages
        ]);
    }
}
