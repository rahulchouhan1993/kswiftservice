<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\ContactUsMessage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactUsEnquiriesController extends Controller
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

    public function list(Request $request)
    {
        $search = $request->query('search');
        $status = $request->query('status');

        if ($status === 'unread') {
            $statusValue = 0;
        } elseif ($status === 'read') {
            $statusValue = 1;
        } else {
            $statusValue = null;
        }

        $baseQuery = ContactUsMessage::orderBy('created_at', 'DESC')
            ->when($search, function ($q) use ($search) {
                $q->where(function ($q) use ($search) {
                    $q->where('name', 'LIKE', "%{$search}%")
                        ->where('email', 'LIKE', "%{$search}%")
                        ->where('phone', 'LIKE', "%{$search}%")
                        ->where('message', 'LIKE', "%{$search}%");
                });
            })
            ->when(!is_null($statusValue), function ($q) use ($statusValue) {
                $q->where('is_read', $statusValue);
            });

        $enquiries = (clone $baseQuery)->paginate($this->per_page ?? 50)->withQueryString();

        return Inertia::render('SuperAdmin/ContactUsEnquiries/List', [
            'list' => $enquiries,
            'search' => $search,
            'status' => $status,
        ]);
    }

    /**
     * Update Read Status
     * @param strign UUID $uuid Read UUID
     * */

    public function updateReadStatus(Request $request, $uuid)
    {
        $message = ContactUsMessage::firstWhere('uuid', $uuid);
        if (!$message) {
            return redirect()->back()->with('error', "Message not found!");
        }
        if (!is_bool($request->status)) {
            return redirect()->back()->with('error', "Invalid Payload!");
        }

        $message->update(['is_read' => ($request->status ? 1 : 0)]);
        return redirect()->back()->with('success', "Message set as " . ($request->status ? 'read' : 'unread') . " successfully");
    }
}
