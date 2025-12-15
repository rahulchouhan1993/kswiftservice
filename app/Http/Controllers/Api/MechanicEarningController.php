<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MechanicEarning;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MechanicEarningController extends Controller
{
    /**
     * Fetch Mechanic Earnings List
     * @return mixed
     */
    public function mechanicEarningsList(Request $request)
    {
        try {
            $mechanicId = $request->user()->id;
            $year = Carbon::now()->year;

            $monthly = MechanicEarning::select(
                DB::raw('MONTH(created_at) as month'),
                DB::raw('SUM(amount) as total')
            )
                ->whereYear('created_at', $year)
                ->where('mechanic_id', $mechanicId)
                ->groupBy(DB::raw('MONTH(created_at)'))
                ->get()
                ->keyBy('month');

            $monthlyData = collect(range(1, 12))->map(function ($month) use ($monthly) {
                return [
                    'month'  => Carbon::create()->month($month)->format('M'),
                    'amount' => $monthly[$month]->total ?? 0,
                ];
            });

            $last7 = MechanicEarning::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(amount) as total')
            )
                ->where('mechanic_id', $mechanicId)
                ->whereDate('created_at', '>=', Carbon::now()->subDays(6))
                ->groupBy(DB::raw('DATE(created_at)'))
                ->get()
                ->keyBy('date');

            $last7DaysData = collect(range(0, 6))->map(function ($i) use ($last7) {
                $date = Carbon::now()->subDays(6 - $i)->toDateString();

                return [
                    'date'   => Carbon::parse($date)->format('d M'),
                    'amount' => $last7[$date]->total ?? 0,
                ];
            });

            return response()->json([
                'status'  => true,
                'message' => 'Earnings statistics fetched',
                'data'    => [
                    'monthly'     => $monthlyData,
                    'last_7_days' => $last7DaysData,
                ]
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status'  => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
