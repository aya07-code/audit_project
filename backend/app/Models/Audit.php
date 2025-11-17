<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Audit extends Model
{
   use HasFactory;

    protected $fillable = ['title', 'company_id', 'date', 'description', 'image'];

    public function companies()
    {
        return $this->belongsToMany(Company::class, 'audit_company');
    }

    public function questions()
    {
        return $this->belongsToMany(Question::class, 'audit_question');
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function activities()
    {
        return $this->belongsToMany(Activity::class, 'activity_audit');
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    public function answers()
    {
        return $this->hasMany(Answer::class);
    }
}
