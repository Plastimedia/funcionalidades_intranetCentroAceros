<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WorkCertificateRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'addressed_to',
        'reason',
        'additional_observations',
        'admin_observations',
        'include_salary',
        'status',
        'rejection_reason',
        'file_path',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    protected function serializeDate(\DateTimeInterface $date): string
    {
        return $date->format('Y-m-d H:i:s');
    }
}
