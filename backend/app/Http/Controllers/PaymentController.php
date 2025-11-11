<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function averagePayment()
    {
        $average = Payment::avg('amount'); 
        $average = round($average, 2);

        return response()->json([
            'average_payment' => $average
        ]);
    }

    public function revenueByMonth()
    {
        $revenue = Payment::selectRaw('MONTH(COALESCE(date, created_at)) as month, SUM(amount) as total')
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(function ($row) {
                return [
                    'month' => date('F', mktime(0, 0, 0, $row->month, 1)), // ex: "November"
                    'total' => $row->total,
                ];
            });

        return response()->json($revenue);
    }

}
