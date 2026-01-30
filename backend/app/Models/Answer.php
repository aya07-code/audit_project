<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Answer extends Model
{
    use HasFactory;

    protected $fillable = ['question_id', 'audit_id', 'customer_id', 'choice', 'reponse','date','certificate_organisme','certificate_customers_count','attachment','comment_admin','validation_status'];

    public function question()
    {
        return $this->belongsTo(Question::class);
    }

    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id'); 
    }

    public function audit()
    {
        return $this->belongsTo(Audit::class , 'audit_id');
    }
}
