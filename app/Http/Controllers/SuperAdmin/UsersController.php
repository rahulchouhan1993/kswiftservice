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

        $baseQuery = User::orderBy('name')
            ->when($search, function ($q) use ($search) {
                $q->where(function ($q) use ($search) {
                    $q->where('name', 'LIKE', "%$search%");
                });
            })
            ->when(!is_null($status) && $status !== '', function ($q) use ($status) {
                $q->where('status', $status);
            });

        $makes = (clone $baseQuery)->paginate($this->per_page ?? 50)->withQueryString();
        return Inertia::render('SuperAdmin/Users/List', [
            'list' => $makes,
            'search' => $search,
            'status' => $status,
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
}
