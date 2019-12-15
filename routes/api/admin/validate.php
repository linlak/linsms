<?php

Route::post('/payment', 'AdminController@valPayment');
Route::post('/user', 'AdminController@valUser');
Route::post('/quote', 'AdminController@createEditQuote');
Route::post('/tutorial', 'AdminController@createEditTutorial');
