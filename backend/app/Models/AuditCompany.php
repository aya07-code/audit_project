<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AuditCompany extends Model
{
    use HasFactory;
    protected $table = 'audit_company';
    protected $fillable = [
        'audit_id',
        'company_id',
        'date',
        'score'
    ];
    public function audit()
    {
        return $this->belongsTo(Audit::class);
    }
    public function company()
    {
        return $this->belongsTo(Company::class);
    }

}
