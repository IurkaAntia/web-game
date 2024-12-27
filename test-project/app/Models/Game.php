<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'name',
        'description',
        'rules',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'rules' => 'array',
    ];

    /**
     * Relationship: Game has many game-user records.
     */
    public function gameUsers()
    {
        return $this->hasMany(GameUser::class);
    }

    /**
     * Relationship: Game is played by many users through the pivot table.
     */
    public function players()
    {
        return $this->belongsToMany(User::class, 'game_user')
            ->withPivot('points', 'played_at')
            ->withTimestamps();
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
