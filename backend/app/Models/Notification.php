<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [ 'text', 'type', 'is_read', 'user_id', 'audit_id', 'company_id'];

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
