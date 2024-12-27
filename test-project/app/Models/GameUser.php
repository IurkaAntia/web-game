<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GameUser extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'user_id',
        'game_id',
        'points',
        'played_at',
    ];

    /**
     * Disable timestamps since they're not needed.
     */
    public $timestamps = false;

    /**
     * Relationship: GameUser belongs to a user.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relationship: GameUser belongs to a game.
     */
    public function game()
    {
        return $this->belongsTo(Game::class);
    }
}
