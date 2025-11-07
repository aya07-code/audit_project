<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'owner_id', 'activity_id' ];

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'owner_id');
    }

    public function activity()
    {
        return $this->belongsTo(Activity::class);
    }

    public function audits()
    {
        return $this->belongsToMany(Audit::class, 'audit_company');
    }
   
}
