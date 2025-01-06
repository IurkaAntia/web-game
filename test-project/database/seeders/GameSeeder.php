<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Game;

class GameSeeder extends Seeder
{
    public function run()
    {
        Game::create([
            'name' => 'Guess the Number',
            'description' => 'Guess a number between 1 and 100. Earn points based on your accuracy!',
            'rules' => json_encode([
                'min_number' => 1,
                'max_number' => 100,
                'points_for_exact' => 10,
                'points_for_close' => 5
            ]),
        ]);
    }
}
