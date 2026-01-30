<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;

class CompanyController extends Controller
{
    public function index(Request $request)
    {
        $query = Company::with(['customer', 'activity', 'audits']);

        // 🔹 Filter by city
        if (!empty($request->city)) {
            $query->whereHas('customer', function ($q) use ($request) {
                $q->where('ville', $request->city);
            });
        }

        // 🔹 Filter by activity
        if (!empty($request->activity_id)) {
            $query->where('activity_id', $request->activity_id);
        }

        // 🔹 Filter by audit
        if (!empty($request->audit_id)) {
            $query->whereHas('audits', function ($q) use ($request) {
                $q->where('audit_company.audit_id', $request->audit_id);
            });
        }

        $companies = $query->get()->map(function ($company) {
            $owner = $company->customer;
            $activity = $company->activity;

            return [
                'id'             => $company->id,
                'company_name'   => $company->name,
                'ICE'            => $company->ICE,
                'RC'             => $company->RC,
                'address'        => $company->address,
                'CNSS'           => $company->CNSS,
                'GPS'            => $company->GPS,
                'activity_name'  => $activity ? $activity->name : null,
                'activity_id'    => $activity ? $activity->id : null,
                'owner_name'     => $owner ? $owner->name : null,
                'owner_email'    => $owner ? $owner->email : null,
                'owner_ville'    => $owner ? $owner->ville : null,
                'owner_id'       => $owner ? $owner->id : null,
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
                'id'      => $company->id, 
                'name'    => $company->name,
                'ICE'     =>$company->ICE,
                'RC'      =>$company->RC,
                'address' =>$company->address,
                'CNSS'    => $company->CNSS,
                'GPS'     => $company->GPS,
                'productType' => $company->productType,

            ],
            'customer' => [
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'address' => $user->adress,
            ],
            'activity' => [
                'id' => $company->activity->id ?? null,
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
            'ICE' => 'nullable|string|max:50',
            'RC' => 'nullable|string|max:50',
            'address' => 'nullable|string|max:255',
            'CNSS' => 'nullable|string|max:255',
            'GPS' => 'nullable|string|max:255',
            'productType' => 'nullable|string|max:255',
        ]);

        $company = Company::create([
            'name' => $validated['name'],
            'activity_id' => $validated['activity_id'],
            'owner_id' => $user->id,
            'ICE' => $validated['ICE'] ,
            'RC' => $validated['RC'] ,
            'address' => $validated['address'] ,
            'CNSS' => $validated['CNSS'] ,
            'GPS' => $validated['GPS'] ,
            'productType' => $validated['productType'] ,
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
            'name' => 'required|string|max:255',
            'activity_id' => 'required|exists:activities,id',
            'ICE' => 'nullable|string|max:50',
            'RC' => 'nullable|string|max:50',
            'address' => 'nullable|string|max:255',
            'CNSS' => 'nullable|string|max:255',
            'GPS' => 'nullable|string|max:255',
            'productType' => 'nullable|string|max:255',
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

    public function filtersData()
    {
        // Tous les villes des users
        $cities = \DB::table('users')
            ->whereNotNull('ville')
            ->distinct()
            ->pluck('ville');

        // Toutes les activités
        $activities = \DB::table('activities')
            ->select('id', 'name')
            ->get();

        // Tous les audits
        $audits = \DB::table('audits')
            ->select('id', 'title')
            ->get();

        return response()->json([
            'cities' => $cities,
            'activities' => $activities,
            'audits' => $audits,
        ]);
    }

}
