<?php

namespace App\Http\Controllers;

use App\Models\Game;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class GameController extends Controller
{
    public function index()
    {
        $games = Game::where('id', '>', 0)->get();
        return response()->json($games);
    }

    public function joinGame(Request $request, Game $game)
    {

        $user = Auth::user();
        $existingGame = $user->games()->find($game->id);
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }


        if ($existingGame) {

            return response()->json([
                'message' => 'You have already joined this game.',
                'game' => $game,
                'points' => $existingGame->pivot->points
            ]);

        }

        $user->games()->syncWithoutDetaching([$game->id => ['points' => 0]]);

        return response()->json([
            'message' => 'Game joined successfully!',
            'game' => $game,
        ]);
    }


    public function playGame(Request $request, Game $game)
    {
        $user = Auth::user();

        $validator = Validator::make($request->all(), [
            'points' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }



        $user->games()->syncWithoutDetaching([
            $game->id => [
                'points' => ($request->input('points') ?? 0),
                'played_at' => now(),
            ],
        ]);

        $user->increment('points', $request->input('user_points'));


        return response()->json([
            'message' => 'Game state saved successfully!'
        ]);
    }
}
