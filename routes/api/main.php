<?php


use Illuminate\Http\Request;

Route::get('/contacts', 'MainController@contacts')->name('contact_info');
