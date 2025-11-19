<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UsersController extends Controller
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

        if ($status === 'active') {
            $statusValue = 1;
        } elseif ($status === 'inactive') {
            $statusValue = 0;
        } else {
            $statusValue = null;
        }

        $baseQuery = User::orderBy('name')
            ->when($search, function ($q) use ($search) {
                $q->where(function ($q) use ($search) {
                    $q->where('name', 'LIKE', "%{$search}%");
                });
            })
            ->when(!is_null($statusValue), function ($q) use ($statusValue) {
                $q->where('status', $statusValue);
            })
            ->when(!is_null($type) && $type !== '', function ($q) use ($type) {
                $q->where('role', $type);
            });

        $makes = (clone $baseQuery)->paginate($this->per_page ?? 50)->withQueryString();
        return Inertia::render('SuperAdmin/Users/List', [
            'list' => $makes,
            'search' => $search,
            'status' => $status,
            'type' => $type,
        ]);
    }

    /**
     * Update User Status
     * @param strign UUID $uuid User UUID
     * */

    public function updateStatus(Request $request, $uuid)
    {
        $user = User::firstWhere('uuid', $uuid);
        if (!$user) {
            return redirect()->back()->with('error', "User not found!");
        }
        if (!is_bool($request->status)) {
            return redirect()->back()->with('error', "Invalid Payload!");
        }

        $user->update(['status' => ($request->status ? 1 : 0)]);
        return redirect()->back()->with('success', "User account " . ($request->status ? 'active' : 'inactive') . " successfully");
    }




    /**
     * Update User password
     * @param strign UUID $uuid User UUID
     * */

    public function updatePassword(Request $request, $uuid)
    {
        $request->validate([
            'password' => 'required|string|min:6|confirmed',
        ]);

        $user = User::firstWhere('uuid', $uuid);
        if (!$user) {
            return back()->with('error', 'User not found!');
        }

        $user->update([
            'password' => $request->password,
        ]);

        return back()->with('success', 'Password updated successfully.');
    }


    /**
     * Delete User
     * @param string $uuid UUID User UUID
     * @return mixed
     */
    public function delete($uuid)
    {
        $user = User::where('uuid', $uuid)->first();
        if (!$user) {
            return back()->with('error', "User does not exist");
        }
        $user->delete();

        return redirect()->back()->with('success', 'User deleted successfully');
    }


    /**
     * User Details
     * @param string $uuid UUID User UUID
     * @return mixed
     */
    public function details($uuid)
    {
        $user = User::with(['addresses', 'vehicles', 'vehicles.vehicle_photos'])->where('uuid', $uuid)->first();
        if (!$user) {
            return back()->with('error', "User does not exist");
        }

        return Inertia::render('SuperAdmin/Users/Details', [
            'user' => $user
        ]);
    }
}
