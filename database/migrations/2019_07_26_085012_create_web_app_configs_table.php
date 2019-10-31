<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateWebAppConfigsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('web_app_configs', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('app_id')->unique();
            $table->boolean('funds_enabled')->default(false);
            $table->boolean('payout_enabled')->default(false);
            $table->boolean('sms_enabled')->default(true);
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
        Schema::dropIfExists('web_app_configs');
    }
}
