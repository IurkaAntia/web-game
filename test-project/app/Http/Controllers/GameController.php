<?php

namespace App\Http\Controllers;

use App\Models\Game;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class GameController extends Controller
{
    public function index()
    {
        $games = Game::with('category')->where('is_active', true)->get();
        return response()->json($games, 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:category,id',
            'image' => 'nullable|string',
            'description' => 'nullable|string',
            'is_active' => 'nullable|boolean',
            'rules' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->only(['name', 'category_id', 'description', 'is_active', 'rules']);

        if (isset($data['rules'])) {
            // Check if 'rules' is a JSON string and decode it
            $decodedRules = json_decode($data['rules'], true);

            // If it’s valid JSON, store it as an array
            if (json_last_error() === JSON_ERROR_NONE) {
                $data['rules'] = $decodedRules;
            }
        }


        if ($request->has('image')) {
            $base64Image = $request->input('image');
            if (preg_match('/^data:image\/(\w+);base64,/', $base64Image, $matches)) {
                $extension = strtolower($matches[1]);
                if (!in_array($extension, ['jpg', 'jpeg', 'png'])) {
                    return response()->json(['error' => 'Invalid image format.'], 422);
                }

                $base64Image = substr($base64Image, strpos($base64Image, ',') + 1);
                $imageData = base64_decode($base64Image);

                if ($imageData === false) {
                    return response()->json(['error' => 'Invalid base64 string.'], 422);
                }

                $imageName = 'games/' . uniqid() . '.' . $extension;
                Storage::disk('public')->put($imageName, $imageData);
                $data['image'] = $imageName;
            } else {
                return response()->json(['error' => 'Invalid base64 string format.'], 422);
            }
        }

        $game = Game::create($data);

        return response()->json(['message' => 'Game created successfully', 'data' => $game], 201);
    }

    public function update(Request $request, $id)
    {

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:category,id',
            'image' => 'nullable|string',
            'description' => 'nullable|string',
            'rules' => 'nullable|string',
            'is_active' => 'nullable|boolean',
        ]);


        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }


        $game = Game::findOrFail($id);
        $data = $request->only(['name', 'category_id', 'description', 'is_active', 'rules']);

        if (isset($data['rules'])) {
            $decodedRules = json_decode($data['rules'], true);

            if (json_last_error() === JSON_ERROR_NONE) {
                $data['rules'] = $decodedRules;
            }
        }

        if ($request->filled('image')) {
            $base64Image = $request->input('image');
            if (preg_match('/^data:image\/(\w+);base64,/', $base64Image, $matches)) {
                $extension = strtolower($matches[1]);
                if (!in_array($extension, ['jpg', 'jpeg', 'png'])) {
                    return response()->json(['error' => 'Invalid image format.'], 422);
                }

                $base64Image = substr($base64Image, strpos($base64Image, ',') + 1);
                $imageData = base64_decode($base64Image);

                if ($imageData === false) {
                    return response()->json(['error' => 'Invalid base64 string.'], 422);
                }

                $imageName = 'games/' . uniqid() . '.' . $extension;
                Storage::disk('public')->put($imageName, $imageData);

                if ($game->image && Storage::disk('public')->exists($game->image)) {
                    Storage::disk('public')->delete($game->image);
                }

                $data['image'] = $imageName;
            } else {
                return response()->json(['error' => 'Invalid base64 string format.'], 422);
            }
        }
        Log::info("gameData", $data);

        $game->update($data);

        return response()->json(['message' => 'Game updated successfully', 'data' => $game], 200);
    }

    public function destroy($id)
    {
        try {
            $game = Game::findOrFail($id);

            if ($game->image && Storage::disk('public')->exists($game->image)) {
                Storage::disk('public')->delete($game->image);
            }

            $game->delete();

            return response()->json(['message' => 'Game deleted successfully.'], 200);
        } catch (\Exception $e) {
            Log::error("Failed to delete game: {$e->getMessage()}");
            return response()->json(['message' => 'Failed to delete the game. Please try again.'], 500);
        }
    }

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
                'points' => $existingGame->pivot->points,
            ], 200);
        }

        $user->games()->syncWithoutDetaching([$game->id => ['points' => 0]]);

        return response()->json([
            'message' => 'Game joined successfully!',
            'game' => $game,
        ], 200);
    }

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
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user->games()->syncWithoutDetaching([
            $game->id => [
                'points' => $request->input('points', 0),
                'played_at' => now(),
                'metadata' => json_encode($request->input('metadata', [])),
            ],
        ]);

        $user->increment('points', $request->input('user_points', $request->input('points', 0)));

        return response()->json(['message' => 'Game state updated successfully!'], 200);
    }
}
