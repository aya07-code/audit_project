<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'text',
        'type',
        'name',
        'company_name',
        'phone',
        'email',
        'is_read',
        'user_id',
        'audit_id',
        'company_id',
        'payment_id'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function audit()
    {
        return $this->belongsTo(Audit::class);
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}
