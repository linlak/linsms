<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateQueuedSmsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('queued_sms', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger("user_id", false, true);
            $table->longText("recipients");
            $table->text('sender_id');
            $table->longText("message");
            $table->timestamp("schedule_time");
            $table->boolean("is_queued")->default(false);
            $table->integer("tries", false, true)->default(0);
            $table->boolean('failed')->default(false);
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
        Schema::dropIfExists('queued_sms');
    }
}
