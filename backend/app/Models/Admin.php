<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Admin extends User
{
    protected static function booted()
    {
        static::creating(function ($model) {
            $model->role = 'admin';
        });
    }

    public function customers()
    {
        return $this->hasMany(Customer::class, 'admin_id');
    }

    public function customersPivot()
    {
        return $this->belongsToMany(Customer::class, 'admin_customer', 'admin_id', 'customer_id');
    }
}
