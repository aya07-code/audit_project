<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class Payment extends Model
{
    use HasFactory;

    protected $fillable = ['audit_id', 'client_id', 'amount', 'method', 'status', 'date'];

    public function audit()
    {
        return $this->belongsTo(Audit::class);
    }

    public function client()
    {
        return $this->belongsTo(Customer::class, 'client_id');
    }
}
