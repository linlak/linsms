<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateWebAppHooksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('web_app_hooks', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->uuid('hook_id');
            $table->text('callback_url');
            $table->unsignedBigInteger('app_id');
            $table->boolean('is_activated')->default(true);
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
        Schema::dropIfExists('web_app_hooks');
    }
}
