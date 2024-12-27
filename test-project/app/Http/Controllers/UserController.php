<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Game;

class UserController extends Controller
{
    public function user(Request $request)
    {
        return response()->json($request->user())->header('X-Hidden-Fields', 'Sensitive data such as password is hidden');
    }
}
