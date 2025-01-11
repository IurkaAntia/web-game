<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\GameUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

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
        // Validate incoming request data
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:category,id', // Ensure the category exists
            'image' => 'nullable|string', // Expect a base64-encoded string for the image
            'description' => 'nullable|string',
            'is_active' => 'nullable|boolean', // Optional boolean field
            'rules' => 'nullable|string', // Optional JSON or text rules
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Collect validated input data
        $data = $request->only(['name', 'category_id', 'description', 'is_active', 'rules']);

        // Handle base64 image upload
        if ($request->has('image')) {
            $base64Image = $request->input('image');

            // Extract image extension and validate base64 format
            if (preg_match('/^data:image\/(\w+);base64,/', $base64Image, $matches)) {
                $extension = strtolower($matches[1]); // Extract extension (e.g., png, jpg)

                // Check for valid image extensions
                if (!in_array($extension, ['jpg', 'jpeg', 'png'])) {
                    return response()->json(['error' => 'Invalid image format. Allowed formats: jpg, jpeg, png.'], 422);
                }

                // Remove the base64 header (e.g., "data:image/png;base64,")
                $base64Image = substr($base64Image, strpos($base64Image, ',') + 1);

                // Decode the base64 string into binary data
                $imageData = base64_decode($base64Image);

                if ($imageData === false) {
                    return response()->json(['error' => 'Invalid base64 string.'], 422);
                }

                // Generate a unique file name and save the image
                $imageName = 'games/' . uniqid() . '.' . $extension; // Save under 'games/' directory
                $path = storage_path('app/public/' . $imageName);

                // Write the binary data to a file
                file_put_contents($path, $imageData);

                // Add the saved image path to the data array
                $data['image'] = $imageName;
            } else {
                return response()->json(['error' => 'Invalid base64 string format.'], 422);
            }
        }

        // Create a new game record in the database
        $game = Game::create($data);

        // Return the created game with a success response
        return response()->json(['message' => 'Game created successfully', 'data' => $game], 201);
    }

    // Update a game

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:category,id',
            'image' => 'nullable|string', // Base64 string
            'description' => 'nullable|string',
            'rules' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $game = Game::findOrFail($id);

        if (!$game) {
            return response()->json(['message' => 'Game not found'], 404);
        }

        $data = $request->only(['name', 'category_id', 'description', 'is_active', 'rules']);

        // Handle base64 image upload
        if ($request->has('image')) {
            $base64Image = $request->input('image');

            // Match and extract the extension from the base64 string
            if (preg_match('/^data:image\/(\w+);base64,/', $base64Image, $matches)) {
                $extension = strtolower($matches[1]); // Get the image extension (png, jpg, etc.)

                // Check if it's a valid image extension
                if (!in_array($extension, ['jpg', 'jpeg', 'png'])) {
                    return response()->json(['error' => 'Invalid image format'], 422);
                }

                // Decode the base64 string to binary data
                $base64Image = substr($base64Image, strpos($base64Image, ',') + 1);
                $imageData = base64_decode($base64Image);

                if ($imageData === false) {
                    return response()->json(['error' => 'Invalid base64 string'], 422);
                }

                // Create a unique file name and store the image
                $imageName = 'games/' . uniqid() . '.' . $extension; // Save in 'storage/games'
                $path = storage_path('app/public/' . $imageName);

                // Save the image to the file system
                file_put_contents($path, $imageData);

                // Save the image path in the database
                $data['image'] = $imageName;

                // Delete old image if it exists
                if ($game->image && Storage::exists('public/' . $game->image)) {
                    Storage::delete('public/' . $game->image);
                }
            } else {
                return response()->json(['error' => 'Invalid base64 string'], 422);
            }
        }

        // Update the game record
        $game->update($data);

        return response()->json(['message' => 'Game updated successfully', 'data' => $game]);
    }


    public function destroy($id)
    {
        try {
            // Find the game by ID
            $game = Game::findOrFail($id);

            // Check if the game has an image and delete it from storage
            if ($game->image && Storage::exists('public/' . $game->image)) {
                Storage::delete('public/' . $game->image);
            }

            // Delete the game record from the database
            $game->delete();

            return response()->json([
                'message' => 'Game deleted successfully.',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete the game. Please try again.',
                'error' => $e->getMessage(),
            ], 500);
        }
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
