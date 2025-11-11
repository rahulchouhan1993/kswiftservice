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
}
