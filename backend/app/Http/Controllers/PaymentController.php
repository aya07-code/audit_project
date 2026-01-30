<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\User;
use App\Models\Notification;
use Stripe\Stripe;
use Stripe\Checkout\Session;
use Illuminate\Http\Request;
use App\Models\Audit;

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
        $revenue = Payment::selectRaw('MONTH(due_date) as month, SUM(amount) as total')
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
    
    // Fetch all payments dyal customer
    public function customerPayments(Request $request)
    {
        $user = $request->user();

        $payments = Payment::where('client_id', $user->id)->get();

        $payments->map(function($payment) {
        $payment->amount = $payment->audit->price ?? $payment->amount;
        return $payment;
        });

        return response()->json($payments);
    }
    
    public function payPayment(Request $request, Payment $payment)
    {
        $request->validate([
            'method' => 'required|string|in:Carte,Espèces,Chèque',
            'attachment' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
        ]);

        if ($payment->client_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($request->hasFile('attachment')) {
            $path = $request->file('attachment')->store('payment_attachments', 'public');
            $payment->attachment = $path;
        }

        $payment->method = $request->method;
        $payment->status = 'sending'; // 🔹 NE PAS mettre paid ici
        $payment->is_paid = false;    // 🔹 NE PAS valider côté client
        $payment->save();

        // Notifications pour admin
        $admins = User::where('role', 'admin')->get();
        foreach ($admins as $admin) {
            Notification::create([
                'text' => "Payment received from {$payment->client->name} for audit {$payment->audit->title}",
                'type' => 'audit_payment',
                'user_id' => $admin->id,
                'audit_id' => $payment->audit_id,
                'company_id' => $payment->client->company->id ?? null,
                'payment_id' => $payment->id,
                'is_read' => false
            ]);
        }

        return response()->json([
            'message' => 'Paiement enregistré, en attente de validation',
            'payment' => $payment
        ]);
    }

    public function show(Payment $payment)
    {
        $payment->load(['client.company', 'audit']);

        return response()->json([
            'success' => true,
            'data' => $payment
        ]);
    }

    public function validatePayment($id) 
    {
        $payment = Payment::findOrFail($id);

        $payment->status = 'validated'; // 🔹 directement la string
        $payment->is_paid = true;
        $payment->save();

        // Créer la notification pour le client
        Notification::create([
            'text' => "Votre paiement de {$payment->amount} MAD pour l'audit '{$payment->audit->title}' a été validé.",
            'type' => 'payment_validated',
            'user_id' => $payment->client_id, // le client reçoit la notif
            'is_read' => false,
            'audit_id' => $payment->audit_id,
            'company_id' => $payment->client->company->id ?? null,
            'payment_id' => $payment->id
        ]);

        return response()->json(['message' => 'Payment validated', 'data' => $payment]);
    }
}
