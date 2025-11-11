<?php
namespace App\Http\Controllers;

use App\Models\Audit;
use App\Models\Company;
use App\Models\Payment;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function dashboardSummary()
    {
        $audits_count = Audit::count();
        $companies_count = Company::count();

        // Moyenne des scores des audits (score peut être null)
        $average_audit_score = Audit::whereNotNull('score')->avg('score');
        $average_audit_score = round($average_audit_score, 2);

        // Somme des revenus des payments
        $revenue_this_month = Payment::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->sum('amount');

        return response()->json([
            'audits_count' => $audits_count,
            'companies_count' => $companies_count,
            'average_audit_score' => $average_audit_score,
            'revenue_this_month' => $revenue_this_month,
        ]);
    }

    // Exemple pour analytics si tu veux les graphiques
    public function analytics()
    {
        // Audits par mois
        $audits_by_month = Audit::selectRaw('MONTH(created_at) as month, COUNT(*) as total')
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        // Revenus par mois
        $revenue_by_month = Payment::selectRaw('MONTH(created_at) as month, SUM(amount) as total')
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        // Audits par activité (si relation activities existe)
        $audits_by_activity = \DB::table('audit_activity')
            ->join('activities', 'audit_activity.activity_id', '=', 'activities.id')
            ->select('activities.name as activity_name', \DB::raw('COUNT(audit_activity.audit_id) as audits_count'))
            ->groupBy('activities.name')
            ->get();

        return response()->json([
            'audits_by_month' => $audits_by_month,
            'revenue_by_month' => $revenue_by_month,
            'audits_by_activity' => $audits_by_activity,
        ]);
    }
}
