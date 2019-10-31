<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CrawlablePage extends Model
{
    //
    protected $fillable = [
        'page_url',
        'crawler_priority',
        'page_freq'
    ];
}
