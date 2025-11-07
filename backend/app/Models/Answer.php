<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Answer extends Model
{
    use HasFactory;

    protected $fillable = ['question_id', 'audit_id', 'customer_id', 'choice', 'text' , 'justification'];

    public function question()
    {
        return $this->belongsTo(Question::class);
    }

    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id'); 
    }
}
