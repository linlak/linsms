<?php

namespace App\Services\Utils;

use Illuminate\Database\Schema\Blueprint;

class TableUtils
{
    private function __construct()
    { }
    public static function smsTable(Blueprint $table)
    {
        $table->text('sender_id');
        $table->longText('message');
        $table->bigInteger('pay_id', false, true)->nullable();
        $table->timestamp('sent_at')->nullable();
        $table->timestamp('failed_at')->nullable();
        $table->boolean('is_sent')->default(false);
        $table->integer('sms_after', false, true)->default(0);
        $table->integer('sms_before', false, true)->default(0);
        $table->longText('recipients');
        $table->integer('failed_sms', false, true)->default(0);
        $table->integer('sent_sms', false, true)->default(0);
        $table->boolean('is_failed')->default(false);
    }
}
