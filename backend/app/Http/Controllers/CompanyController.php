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
                'company_name'   => $company->name,
                'activity_name'  => $company->activity->name ?? null,
                'owner_name'     => $company->customer->name ?? null,
                'owner_email'    => $company->customer->email ?? null,
                'owner_ville'    => $company->customer->ville ?? null, 
            ];
        });

        return response()->json($companies);
    }



    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Company $company)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Company $company)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Company $company)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Company $company)
    {
        //
    }
}
