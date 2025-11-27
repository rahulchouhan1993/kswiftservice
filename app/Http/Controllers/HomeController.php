<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Route;
use Inertia\Inertia;

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
}
