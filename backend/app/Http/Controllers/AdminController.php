<?php
namespace App\Http\Controllers;

use App\Models\Audit;
use App\Models\Company;
use App\Models\Payment;
use App\Models\Activity;
use App\Models\AuditCompany;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function summary()
    {
        $audits_count = Audit::count();
        $companies_count = Company::count();
        $average_payment = Payment::avg('amount');
        $average_audit_score = round(
            AuditCompany::whereNotNull('score')->avg('score'),
            1
        );
        $revenue_this_month = Payment::whereMonth('due_date', now()->month)
                                    ->sum('amount');

        // 📅 Audits par mois
        $audits_by_month = AuditCompany::whereNotNull('date')
            ->select(
                DB::raw('MONTH(date) as month'),
                DB::raw('COUNT(*) as total')
            )
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(function ($row) {
                return [
                    'month' => date('F', mktime(0, 0, 0, $row->month, 1)),
                    'total' => $row->total,
                ];
            });

        // 💰 Revenus par mois
        $revenue_by_month = Payment::select(
            DB::raw('MONTH(due_date) as month'),
            DB::raw('SUM(amount) as total')
        )
        ->groupBy('month')
        ->orderBy('month')
        ->get()
        ->map(function ($row) {
            return [
                'month' => date('F', mktime(0, 0, 0, $row->month, 1)),
                'total' => $row->total,
            ];
        });

        // 📊 Audits par activité
        $audits_by_activity = Activity::select('name')
            ->withCount('audits')
            ->get()
            ->map(fn($a) => ['name' => $a->name, 'value' => $a->audits_count]);

        return response()->json([
            'audits_count' => $audits_count,
            'companies_count' => $companies_count,
            'average_audit_score' => $average_audit_score,
            'revenue_this_month' => $revenue_this_month,
            'average_payment' => $average_payment,
            'audits_by_month' => $audits_by_month,
            'revenue_by_month' => $revenue_by_month,
            'audits_by_activity' => $audits_by_activity,
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

    public function validatePayment($id) {
        $payment = Payment::findOrFail($id);
        $payment->status = 'validated'; // 🔹 C’est l’admin qui valide
        $payment->is_paid = true;       // 🔹 Maintenant le paiement est réellement payé
        $payment->save();

        return response()->json(['message' => 'Payment validated', 'data' => $payment]);
    }


}
