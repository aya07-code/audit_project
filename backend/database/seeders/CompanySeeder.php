<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Company;
use App\Models\Activity;
use App\Models\User;
use App\Models\Audit;
use Illuminate\Support\Facades\DB;

class CompanySeeder extends Seeder
{
    public function run(): void
    {
        $customers = User::where('role', 'customer')->get();
        $activities = Activity::with('audits')->get();

        foreach ($customers as $customer) {
            // نختار Activity عشوائي للشركة
            $activity = $activities->random();

            // إنشاء الشركة
            $company = Company::create([
                'name' => 'Société de ' . $customer->name,
                'owner_id' => $customer->id,
                'activity_id' => $activity->id,
            ]);

            // نجيب الـ audits ديال هاد الـ activity
            $activityAudits = $activity->audits;

            if ($activityAudits->count() > 0) {
                // نختار 1 إلى 3 audits عشوائية من activity المحددة
                $randomAudits = $activityAudits->random(rand(1, min(3, $activityAudits->count())));

                // ندير الربط في جدول pivot audit_company
                foreach ($randomAudits as $audit) {
                    DB::table('audit_company')->insert([
                        'audit_id' => $audit->id,
                        'company_id' => $company->id,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        }
    }
}
