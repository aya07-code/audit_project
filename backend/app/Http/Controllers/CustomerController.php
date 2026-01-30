<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Company;
use App\Models\Audit;
use App\Models\Payment;
use App\Models\AuditCompany;
use App\Models\User;
use App\Models\Notification;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function addAuditToCompany(Request $request)
    {
        $user = $request->user(); // User authentifié
        if ($user->role !== 'customer') {
            return response()->json(['error' => 'Only customers can start audits'], 403);
        }

        $company = Company::where('owner_id', $user->id)->first();
        if (!$company) {
            return response()->json([
                'error' => 'Company not found for this user',
                'user_id' => $user->id,
                'user_role' => $user->role
            ], 400);
        }

        $auditId = $request->audit_id;
        $audit = Audit::find($auditId);
        if (!$audit) {
            return response()->json(['error' => 'Audit not found', 'audit_id' => $auditId], 404);
        }

        // Ajouter l’audit à la company avec date et score
        $company->audits()->syncWithoutDetaching([
            $auditId => [
                'date' => now(),   // correspond à la colonne 'date' de la table pivot
                'score' => 0,      // initialisé à zéro
                'is_submitted' => false,
                'status' => 'Pending'
            ]
        ]);

        return response()->json([
            'message' => 'Audit successfully added to company',
            'company_id' => $company->id,
            'audit_id' => $auditId,
            'date' => now(),
            'score' => 0,
            'is_submitted' => false,
            'status' => 'Pending'
        ]);
    }

    public function createAuditPayment(Request $request)
    {
        $user = $request->user();
        $auditId = $request->audit_id;
        $audit = Audit::findOrFail($auditId);

        $company = Company::where('owner_id', $user->id)->firstOrFail();

        $payment = Payment::create([
            'client_id' => $user->id,
            'audit_id' => $audit->id ?? null, // ajoute audit_id dans fillable si nécessaire
            'amount' => $audit->price ?? 0,
            'method' => 'pending', // par défaut pour éviter l'erreur 500
            'status' => 'pending',
            'is_paid' => false,
            'due_date' => now(),
        ]);

        return response()->json($payment, 201);
    }

    public function notifyAuditStart(Request $request)
    {
        $auditId = $request->audit_id;
        $audit = Audit::findOrFail($auditId);
        $company = Company::where('owner_id', auth()->id())->firstOrFail();

        $admins = User::where('role', 'admin')->get();

        foreach ($admins as $admin) {
            Notification::create([
                'text' => "The company {$company->name} has started the audit '{$audit->title}'",
                'type' => 'audit_started',
                'user_id' => $admin->id,
                'audit_id' => $auditId,
                'company_id' => $company->id,
                'is_read' => false
            ]);
        }

        return response()->json(['message' => 'Admins notified'], 201);
    }


    public function destroy(Customer $customer)
    {
        $customer->company()?->delete();
        $customer->delete();
    }
}
