<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;

class CompanyController extends Controller
{

    public function index()
    {
        // Charger les companies avec leurs propriétaires et leur activité
        $companies = Company::with(['customer', 'activity'])->get();

        // Transformer le résultat pour ne retourner que ce dont tu as besoin
        $companies = $companies->map(function($company) {
            return [
                'id'             => $company->id, // 🔹 important
                'company_name'   => $company->name,
                'activity_name'  => $company->activity->name ?? null,
                'activity_id'    => $company->activity->id ?? null, // 🔹 utile pour edit
                'owner_name'     => $company->customer->name ?? null,
                'owner_email'    => $company->customer->email ?? null,
                'owner_ville'    => $company->customer->ville ?? null,
                'owner_id'       => $company->customer->id ?? null, // 🔹 utile pour edit
            ];
        });

        return response()->json($companies);
    }

    public function customerCompanyInfo(Request $request)
    {
        $user = $request->user();

        // جلب الشركة ديال هذا الcustomer
        $company = Company::with('activity')
            ->where('owner_id', $user->id)
            ->first();

        if (! $company) {
            return response()->json(['message' => 'Aucune entreprise trouvée'], 404);
        }

        return response()->json([
            'company' => [
                'name' => $company->name,
            ],
            'customer' => [
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'address' => $user->adress,
            ],
            'activity' => [
                'name' => $company->activity->name ?? null,
                'description' => $company->activity->description ?? null,
            ]
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        // Vérifie que l'utilisateur est client
        if (! $user->isCustomer()) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        // Vérifie qu’il n’a pas déjà une company
        if ($user->company) {
            return response()->json(['message' => 'Vous avez déjà une compagnie.'], 400);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'activity_id' => 'required|exists:activities,id',
        ]);

        $company = Company::create([
            'name' => $validated['name'],
            'activity_id' => $validated['activity_id'],
            'owner_id' => $user->id,
        ]);

        return response()->json(['message' => 'Compagnie créée avec succès', 'company' => $company], 201);
    }


    public function update(Request $request, $id)
    {
        $company = Company::find($id);
        if (!$company) {
            return response()->json(['message' => 'Compagnie non trouvée'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'activity_id' => 'sometimes|exists:activities,id',
            'owner_id' => 'sometimes|exists:users,id',
        ]);

        $company->update($validated);

        return response()->json(['message' => 'Compagnie mise à jour avec succès', 'company' => $company]);
    }

    public function destroy($id)
    {
        $company = Company::find($id);

        if (!$company) {
            return response()->json(['message' => 'Compagnie non trouvée'], 404);
        }

        try {
            // Supprimer le customer lié à cette compagnie
            $customer = $company->customer; // relation owner_id -> users.id
            if ($customer) {
                $customer->delete();
            }

            // Supprimer la compagnie
            $company->delete();

            return response()->json(['message' => 'Compagnie et client supprimés avec succès'], 200);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Erreur lors de la suppression'], 500);
        }
    }


}
