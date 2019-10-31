<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCrawlablePagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('crawlable_pages', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->text('page_url');
            $table->float('crawler_priority', 2, 1)->default(0.1);
            $table->string('page_freq')->default('weekly');
            $table->unsignedBigInteger('visists')->default(1);
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
        Schema::dropIfExists('crawlable_pages');
    }
}
