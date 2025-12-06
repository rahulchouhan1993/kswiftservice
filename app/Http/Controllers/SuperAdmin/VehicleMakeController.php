<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\VehicleMake;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class VehicleMakeController extends Controller
{
    protected $per_page;
    public function __construct()
    {
        $this->per_page = env('PER_PAGE', 50);
    }

    /**
     * Display Resourse Page
     * @param Request $request
     * @return mixed
     */

    public function index(Request $request)
    {
        $search = $request->query('search');
        $status = $request->query('status');
        $type = $request->query('type');

        $baseQuery = VehicleMake::orderBy('name')
            ->when($search, function ($q) use ($search) {
                $q->where(function ($q) use ($search) {
                    $q->where('name', 'LIKE', "%$search%");
                });
            })
            ->when(!is_null($status) && $status !== '', function ($q) use ($status) {
                $q->where('status', $status);
            })
            ->when(!is_null($type), function ($q) use ($type) {
                $q->where('vehicle_type', $type);
            });

        $makes = (clone $baseQuery)->paginate($this->per_page ?? 50)->withQueryString();
        return Inertia::render('SuperAdmin/Settings/VehicleMake/List', [
            'list' => $makes,
            'search' => $search,
            'status' => $status,
            'type' => $type,
        ]);
    }

    /**
     * Add Vechile Make
     * @param Request $request
     * @return mixed
     */

    public function add(Request $request)
    {
        $request->validate([
            'name' => [
                'required',
                'string',
                Rule::unique('vehicle_makes', 'name')
            ],
            'vehicle_type' => [
                'required',
            ],
        ]);

        VehicleMake::create([
            'name' => $request->name,
            'vehicle_type' => $request->vehicle_type,
        ]);

        return back()->with('success', "Record added succesfully..");
    }


    /**
     * Update Vehicle Make
     * @param string UUID $uuid Vehicle Male UUID
     * @param Request $request
     * @return mixed
     */
    public function update(Request $request, $uuid)
    {
        $make = VehicleMake::where('uuid', $uuid)->first();

        if (!$make) {
            return back()->with('errror', "Vehicle make does not exist");
        }

        $request->validate([
            'name' => [
                'required',
                'string',
                Rule::unique('vehicle_makes', 'name')->ignore($make)
            ],
            'vehicle_type' => [
                'required',
            ],
        ]);

        $make->update([
            'name' => $request->name,
            'vehicle_type' => $request->vehicle_type,
        ]);

        return back()->with('success', "Record updated succesfully..");
    }


    /**
     * Update Vehicle Make Status
     * @param strign UUID $uuid Vehicle Make UUID
     * */

    public function updateStatus(Request $request, $uuid)
    {
        $make = VehicleMake::firstWhere('uuid', $uuid);
        if (!$make) {
            return redirect()->back()->with('error', "Vehicle make not found!");
        }
        if (!is_bool($request->status)) {
            return redirect()->back()->with('error', "Invalid Payload!");
        }

        $make->update(['status' => ($request->status ? 1 : 0)]);
        return redirect()->back()->with('success', "Vehicle make " . ($request->status ? 'active' : 'inactive') . " successfully");
    }


    /**
     * Delete Vehicle Make
     * @param string $uuid UUID Vehicle Male UUID
     * @return mixed
     */
    public function delete($uuid)
    {
        $make = VehicleMake::where('uuid', $uuid)->first();
        if (!$make) {
            return back()->with('error', "Vehicle make does not exist");
        }
        $make->delete();

        return redirect()->back()->with('success', 'Vehicle make deleted successfully');
    }
}
