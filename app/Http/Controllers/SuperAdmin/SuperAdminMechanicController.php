<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\City;
use App\Models\Country;
use App\Models\State;
use App\Models\User;
use App\Models\UserAddress;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

use function App\uploadRequestFile;

class SuperAdminMechanicController extends Controller
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

        if ($status === 'active') {
            $statusValue = 1;
        } elseif ($status === 'inactive') {
            $statusValue = 0;
        } else {
            $statusValue = null;
        }

        $baseQuery = User::with(['addresses'])
            ->whereRole('mechanic')
            ->withSum('mechanic_earnings', 'amount')
            ->withCount(['mechanic_booking'])
            ->orderBy('name')
            ->when($search, function ($q) use ($search) {
                $q->where(function ($q) use ($search) {
                    $q->where('name', 'LIKE', "%{$search}%")
                        ->orWhere('email', 'LIKE', "%{$search}%")
                        ->orWhere('phone', 'LIKE', "%{$search}%");
                });
            })
            ->when(!is_null($statusValue), function ($q) use ($statusValue) {
                $q->where('status', $statusValue);
            });

        $users = (clone $baseQuery)->paginate($this->per_page ?? 50)->withQueryString();
        $country = Country::whereName('india')->first();
        $states = State::whereCountryId($country->id)->get()->pluck('id', 'name');
        $cities = City::get();

        return Inertia::render('SuperAdmin/Mechanics/List', [
            'list' => $users,
            'search' => $search,
            'status' => $status,
            'states' => $states,
            'cities' => $cities
        ]);
    }


    /**
     * Add Mechanic
     * @param Request $request
     * @return mixed
     */
    public function add(Request $request)
    {
        $request->validate([
            "user_type"        => "required|in:mechanic,customer",
            "name"             => "required|string|max:100",
            "email"            => "nullable|email|unique:users,email",
            "phone"            => "required|digits:10|unique:users,phone",
            "whatsapp_phone"   => "nullable|digits:10|unique:users,whatsapp_number",
            "state_id"         => "nullable|integer|exists:states,id",
            "city_id"          => "nullable|integer|exists:cities,id",
            "address"          => "nullable|string|max:500",
            "pincode"          => "nullable|digits:6",
            "dob"              => "nullable",
            "photo"            => "nullable|image|mimes:jpg,jpeg,png|max:2048",
            "password"         => "nullable|confirmed",
        ]);

        $user = User::create([
            'role' => $request->user_type,
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'whatsapp_number' => $request->whatsapp_phone,
            'dob' => $request->dob,
            'password' => $request->password,
        ]);

        if ($request->hasFile('photo')) {
            uploadRequestFile($request, 'photo', $user, 'users_photos', 'profile_pic');
        }

        UserAddress::create([
            'user_id' => $user->id,
            'country_id' => 1,
            'address_type' => $request->address_type,
            'state_id' => $request->state_id,
            'city_id' => $request->city_id,
            'address' => $request->address,
            'pincode' => $request->pincode,
        ]);

        return back()->with('success', ucwords($request->user_type) . ' added successfully');
    }


    /**
     * Update User
     * @param Request $request
     * @param string $uuid User UUID
     * @return mixed
     */
    public function update(Request $request, $uuid)
    {
        $user = User::where('uuid', $uuid)->first();
        if (!$user) {
            return back()->with('error', 'User does not exist');
        }

        $request->validate([
            "user_type"        => "required|in:mechanic,customer",
            "name"             => "required|string|max:100",
            "email"            => [
                'nullable',
                Rule::unique('users', 'email')->ignore($user->id)
            ],
            "phone"            => [
                'required',
                Rule::unique('users', 'phone')->ignore($user->id)
            ],
            "whatsapp_phone"            => [
                'nullable',
                Rule::unique('users', 'whatsapp_number')->ignore($user->id)
            ],
            "dob"              => "nullable",
            "photo"            => "nullable|image|mimes:jpg,jpeg,png|max:2048",
            "password"         => "nullable|confirmed",
        ]);

        $user->update([
            'role' => $request->user_type,
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'whatsapp_number' => $request->whatsapp_phone,
            'dob' => $request->dob,
        ]);

        if ($request->hasFile('photo')) {
            uploadRequestFile($request, 'photo', $user, 'users_photos', 'profile_pic');
        }

        return back()->with('success', ucwords($request->user_type) . ' updated successfully');
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
        $user = User::with(['addresses', 'addresses.state', 'addresses.city', 'garage', 'garage.state', 'garage.city'])
            ->withSum('mechanic_earnings', 'amount')
            ->withCount(['mechanic_booking'])
            ->where('uuid', $uuid)
            ->first();
        if (!$user) {
            return back()->with('error', "User does not exist");
        }

        return Inertia::render('SuperAdmin/Mechanics/Details', [
            'user' => $user
        ]);
    }
}
