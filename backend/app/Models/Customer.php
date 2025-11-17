<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends User
{
    use HasFactory;
    
    protected $table = 'users';

    protected static function booted()
    {
        static::creating(function ($model) {
            $model->role = 'customer';
        });
    }

    public function company()
    {
        return $this->hasOne(Company::class , 'owner_id');
    }

    public function admin()
    {
        return $this->belongsTo(Admin::class, 'admin_id');
    }

    public function payments()
    {
        return $this->hasMany(Payment::class, 'client_id');
    }

    public function adminsPivot()
    {
        return $this->belongsToMany(Admin::class, 'admin_customer', 'customer_id', 'admin_id');
    }

}
