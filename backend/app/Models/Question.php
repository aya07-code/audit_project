<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
use HasFactory;

    protected $fillable = ['text', 'type', 'activity_id', 'audit_id'];

    public function audits()
    {
        return $this->belongsToMany(Audit::class, 'audit_question');
    }

    public function answers()
    {
        return $this->hasMany(Answer::class);
    }
}
