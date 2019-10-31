<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMe2USTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('me2_u_s', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('user_id', false, true);
            $table->bigInteger('recipient_id', false, true);
            $table->string('sms_voucher', false, true);
            $table->bigInteger('sms_count', false, true);
            $table->bigInteger('from_ref', false, true)->nullable();
            $table->bigInteger('to_ref', false, true)->nullable();
            // $table->

            $table->timestamp('redeemed_at')->nullable();

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
        Schema::dropIfExists('me2_u_s');
    }
}
