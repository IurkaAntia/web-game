<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGamesTable extends Migration
{
    public function up()
    {
        Schema::create('games', function (Blueprint $table) {
            $table->id(); // Primary key: id
            $table->string('name'); // Game name
            $table->text('description');
            $table->json('rules');
            $table->unsignedBigInteger('category_id'); // Foreign key: category_id
            $table->timestamps(); // Created_at and updated_at
            // Foreign key constraint
            $table->foreign('category_id')->references('id')->on('category')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('games');
    }
}
