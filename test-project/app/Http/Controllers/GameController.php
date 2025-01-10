<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\GameUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

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
            'category_id' => 'required|exists:category,id',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->only(['name', 'category_id', 'description', 'is_active', 'rules']);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('games', 'public');
        }

        // Create the game with the provided data
        $game = Game::create($data);

        return response()->json($game, 201);
    }

    // Update a game


    public function update(Request $request, $id)
    {
        $game = Game::findOrFail($id);

        // Log incoming request data (this is just for debugging)
        Log::info('Request Data:', $request->all());

        // Validate the request fields
        $validated = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:category,id',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'description' => 'nullable|string',
            'rules' => 'nullable',  // rules can be either a string or JSON
        ]);

        // Check if validation failed
        if ($validated->fails()) {
            return response()->json(['errors' => $validated->errors()], 422);
        }

        // Extract validated data
        $data = $validated->validated();

        // Handle the 'rules' field if it's passed as JSON (make sure it's decoded properly)
        if ($request->has('rules')) {
            $data['rules'] = json_decode($request->input('rules'), true);  // Convert JSON string to array if present
        }

        // Check if an image was uploaded and store it
        if ($request->hasFile('image')) {
            // Store the image in the 'games' directory
            $imagePath = $request->file('image')->store('games', 'public');
            $data['image'] = $imagePath;  // Add image path to data
        }

        // Update the game with the validated data
        $game->update($data);

        // Return the updated game as a JSON response
        return response()->json($game, 200);
    }




    // Delete a game
    public function destroy(Game $game)
    {
        $game->delete();
        return response()->json(['message' => 'Game deleted successfully']);
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

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $validator = Validator::make($request->all(), [
            'points' => 'nullable|integer|min:0',
            'metadata' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error occurred.',
                'errors' => $validator->errors(),
            ], 422);
        }

        // Update the pivot table
        $user->games()->syncWithoutDetaching([
            $game->id => [
                'points' => $request->input('points', 0),
                'played_at' => now(),
                'metadata' => json_encode($request->input('metadata', [])),
            ],
        ]);

        $user->increment('points', $request->input('user_points') ?? $request->input('points'));

        return response()->json([
            'message' => 'Game state updated successfully!',
        ]);
    }

}
