<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{

    use HasFactory;

    protected $fillable = ['name', 'description'];

    public function companies()
    {
        return $this->hasMany(Company::class);
    }

    public function audits()
    {
        return $this->belongsToMany(Audit::class, 'activity_audit');
    }
}
