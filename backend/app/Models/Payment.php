<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class Payment extends Model
{
    use HasFactory;

    protected $fillable = [ 'client_id','audit_id', 'amount', 'method', 'status', 'due_date','is_paid','attachment'];

    public function client()
    {
        return $this->belongsTo(Customer::class, 'client_id');
    }

    public function audit()
    {
        return $this->belongsTo(Audit::class);
    }
}
