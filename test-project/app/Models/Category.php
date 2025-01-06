<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $primaryKey = 'id';
    protected $table = 'category';
    protected $fillable = ['name'];

    public function gameCategory()
    {

        // return $this->belongsTo(Game::class);
        return $this->hasMany(Game::class);
    }
}
