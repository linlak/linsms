<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSmsPaymentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sms_payments', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('user_id', false, true);
            $table->string('p_ref')->unique();

            $table->boolean('is_m2u')->default(false);
            $table->integer('sms_count', false, true)->default(0);
            $table->integer('me2u_count', false, true)->default(0);
            $table->bigInteger('m2u_id', false, true)->nullable();

            $table->integer('sms_brought', false, true)->default(0);
            $table->integer('sms_carried', false, true)->default(0);
            $table->integer('sms_shared', false, true)->default(0);
            $table->integer('sms_price', false, true)->default(0);
            $table->integer('sms_used', false, true)->default(0);

            $table->enum('status', ['0', '1', '2', '3'])->default('0');

            $table->timestamp('last_used')->nullable();
            $table->timestamp('carried_at')->nullable();
            $table->timestamp('verified_at')->nullable();

            $table->bigInteger('b_frm', false, true)->nullable();
            $table->bigInteger('c_to', false, true)->nullable();
            $table->string('phone')->nullable();
            $table->string('trans_id')->nullable();
            $table->string('pay_mtd')->nullable();
            $table->bigInteger('admin_id', false, true)->nullable();
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
        Schema::dropIfExists('sms_payments');
    }
}
