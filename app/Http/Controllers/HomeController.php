<?php

namespace App\Http\Controllers;

use App\Models\ContactUsMessage;
use Illuminate\Http\Request;
use Illuminate\Routing\Route;
use Inertia\Inertia;
use Twilio\Rest\Api\V2010\AccountContext;

class HomeController extends Controller
{
    /**
     * Display Login Page
     * @return mixed
     */
    public function home()
    {
        return Inertia::render('Welcome');
    }

    public function aboutUs()
    {
        return Inertia::render('AboutUs');
    }

    public function services()
    {
        return Inertia::render('Services');
    }

    public function contactUs()
    {
        return Inertia::render('ContactUs');
    }


    /**
     * Submit Contact Us Form
     * @param Request $request
     * @return mixed
     */
    public function submitContactUs(Request $request)
    {
        $request->validate([
            'name' => [
                'required'
            ],
            'phone' => [
                'required',
                'digits:10'
            ],
            'email' => [
                'required',
                'email:DNS'
            ],
            'message' => [
                'required',
                'min:50'
            ],
        ]);

        ContactUsMessage::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'message' => $request->message,
        ]);

        return back()->with('success', "Thank you! We’ll get in touch with you shortly.");
    }

    public function privacyPolicy()
    {
        return Inertia::render('PrivacyPolicy');
    }

    public function termsConditions()
    {
        return Inertia::render('TermsConditions');
    }

    public function partnerTermsConditions()
    {
        return Inertia::render('PartnerTermsConditions');
    }

    public function customerTermsConditions()
    {
        return Inertia::render('CustomerTermsConditions');
    }

    public function businessPolicy()
    {
        return Inertia::render('BusinessPolicy');
    }

    public function offers()
    {
        return Inertia::render('Offers');
    }


    /**
     * Manage Delete Account Page
     * @param Request $request
     * @return mixed
     */
    public function deleteAccount(Request $request)
    {
        if ($request->isMethod('post')) {
            return back()->with('success', 'Request submitted..');
        }

        return Inertia::render('AccountDelete');
    }
}
