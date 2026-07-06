<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AdvanceRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'required_date',
        'advance_type',
        'amount',
        'reason',
        'description',
        'authorization',
        'status',
        'rejection_reason',
        'admin_observations',
    ];

    protected $casts = [
        'authorization' => 'boolean',
        'amount' => 'decimal:2',
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
