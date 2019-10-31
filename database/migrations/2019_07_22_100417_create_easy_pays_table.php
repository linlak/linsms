<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEasyPaysTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('easy_pays', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->morphs('easable');
            $table->bigInteger('amount', false, true);
            $table->text('phone');
            $table->text('reason');
            $table->text('transactionId')->nullable();
            $table->boolean('verified')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('easy_pays');
    }
}
