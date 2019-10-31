<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateWesocketAppsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('wesocket_apps', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('user_id')->nullable();

            $table->boolean('enable_client_messages')->default(false);
            $table->boolean('enable_statistics')->default(true);
            $table->boolean('is_editable')->default(true);

            $table->string('app_key')->unique();
            $table->string('app_secret')->unique();

            $table->string('app_name');
            $table->string('app_host')->nullable();

            $table->unsignedBigInteger('capacity')->nullable();

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
        Schema::dropIfExists('wesocket_apps');
    }
}
