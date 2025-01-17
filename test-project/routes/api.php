<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CategoryController;

use Illuminate\Support\Facades\Route;

Route::post('login', [AuthController::class, 'login']);
Route::post('register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('categories', [CategoryController::class, 'index']);
    Route::get('user', [UserController::class, 'user']);
    Route::get('games', [GameController::class, 'index']);
    Route::get('games/{game}', [GameController::class, 'joinGame']);
    Route::post('games/store', [GameController::class, 'store']);
    Route::put('games/{game}/update', [GameController::class, 'update']);
    Route::post('games/{game}/play', [GameController::class, 'playGame']);
    Route::delete('/games/{id}/destroy', [GameController::class, 'destroy']);

});

Route::post('/logout', [AuthController::class, 'logout']);
