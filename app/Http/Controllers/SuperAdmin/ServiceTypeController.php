<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\ServiceType;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ServiceTypeController extends Controller
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

        $baseQuery = ServiceType::orderBy('name')
            ->when($search, function ($q) use ($search) {
                $q->where(function ($q) use ($search) {
                    $q->where('name', 'LIKE', "%$search%");
                });
            })
            ->when(!is_null($status) && $status !== '', function ($q) use ($status) {
                $q->where('status', $status);
            });

        $makes = (clone $baseQuery)->paginate($this->per_page ?? 50)->withQueryString();
        return Inertia::render('SuperAdmin/Settings/ServiceType/List', [
            'list' => $makes,
            'search' => $search,
            'status' => $status,
        ]);
    }

    /**
     * Add Service Type Make
     * @param Request $request
     * @return mixed
     */

    public function add(Request $request)
    {
        $request->validate([
            'name' => [
                'required',
                'string',
                Rule::unique('service_types', 'name')
            ],
            'vehicle_type' => [
                'required',
            ],
            'base_price' => [
                'required',
            ]
        ]);

        ServiceType::create([
            'name' => $request->name,
            'vehicle_type' => $request->vehicle_type,
            'base_price' => $request->base_price,
        ]);

        return back()->with('success', "Service type added succesfully..");
    }


    /**
     * Update Service Type
     * @param string UUID $uuid Service Type UUID
     * @param Request $request
     * @return mixed
     */
    public function update(Request $request, $uuid)
    {
        $type = ServiceType::where('uuid', $uuid)->first();

        if (!$type) {
            return back()->with('errror', "Service type make does not exist");
        }

        $request->validate([
            'name' => [
                'required',
                'string',
                Rule::unique('service_types', 'name')->ignore($type)
            ],
            'vehicle_type' => [
                'required',
            ],
            'base_price' => [
                'required',
            ]
        ]);

        $type->update([
            'name' => $request->name,
            'vehicle_type' => $request->vehicle_type,
            'base_price' => $request->base_price,
        ]);

        return back()->with('success', "Service type updated succesfully..");
    }


    /**
     * Update Service type Status
     * @param strign UUID $uuid Service type UUID
     * */

    public function updateStatus(Request $request, $uuid)
    {
        $type = ServiceType::firstWhere('uuid', $uuid);
        if (!$type) {
            return redirect()->back()->with('error', "Service type make not found!");
        }
        if (!is_bool($request->status)) {
            return redirect()->back()->with('error', "Invalid Payload!");
        }

        $type->update(['status' => ($request->status ? 1 : 0)]);
        return redirect()->back()->with('success', "Service type " . ($request->status ? 'active' : 'inactive') . " successfully");
    }


    /**
     * Delete Service Type
     * @param string $uuid UUID Service Type UUID
     * @return mixed
     */
    public function delete($uuid)
    {
        $type = ServiceType::where('uuid', $uuid)->first();
        if (!$type) {
            return back()->with('error', "Service Type does not exist");
        }
        $type->delete();

        return redirect()->back()->with('success', 'Service type deleted successfully');
    }
}
