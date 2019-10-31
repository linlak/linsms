<?php


use Illuminate\Http\Request;

Route::get('/prices', 'MainController@prices')->name('prices');
Route::get('/buy', 'SmsController@priceValues')->name('pricevalues');
Route::get('/cal', 'SmsController@showCal')->name('cal');

Route::middleware('auth')->group(__DIR__ . '/sms/user.php');
