<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\GameUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class GameController extends Controller
{
    public function index()
    {
        $games = Game::with('category')->where('is_active', true)->get();
        return response()->json($games);
    }

    // Create a new game
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->only(['name', 'category_id', 'description', 'is_active', 'rules']);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('games', 'public');
        }

        $game = Game::create($data);

        return response()->json($game, 201);
    }

    // Update a game
    public function update(Request $request, $id)
    {
        $game = Game::find($id);

        if (!$game) {
            return response()->json(['message' => 'Game not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'category_id' => 'sometimes|required|exists:categories,id',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->only(['name', 'category_id', 'description', 'is_active']);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('games', 'public');
        }

        $game->update($data);

        return response()->json($game);
    }


    // Delete a game
    public function destroy(Game $game)
    {
        $game->delete();
        return response()->json(['message' => 'Game deleted successfully']);
    }

    // Store game session data
    public function storeGameSession(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'game_id' => 'required|exists:games,id',
            'user_id' => 'required|exists:users,id',
            'is_winner' => 'required|boolean',
            'metadata' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $gameSession = GameUser::create([
            'game_id' => $request->input('game_id'),
            'user_id' => $request->input('user_id'),
            'is_winner' => $request->input('is_winner'),
            'played_at' => now(),
            'metadata' => json_encode($request->input('metadata', [])),
        ]);

        return response()->json($gameSession, 201);
    }

    // Join a game
    public function joinGame(Request $request, Game $game)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $existingGame = $user->games()->find($game->id);
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

    // Play a game and update user points
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

        $user->increment('points', $request->input('user_points') ?? $request->input('points'));

        return response()->json([
            'message' => 'Game state saved successfully!'
        ]);
    }
}
