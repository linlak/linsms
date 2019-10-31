<?php

Route::post('/calc', 'SmsController@parseNumbers');
Route::post('/send', 'SmsController@sendMesage');
Route::post('/m2u', 'SmsController@valMe2u');

Route::post('/paynow', 'SmsController@payNow');

Route::post('/buy', 'SmsController@buysms')->name('buysms');
Route::post('/phonebook', 'SmsController@valPhonebook')->name('createphonebook');
