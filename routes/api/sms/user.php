<?php
Route::prefix('val')->group(__DIR__ . '/validate.php');

Route::get('/payments', 'SmsController@allpayments');
Route::get('/payment/{id}', 'SmsController@singlePayment');
Route::get('/phonebook', 'SmsController@phonebook');
Route::get('/sent', 'SmsController@sentSms');
Route::get('/pending', 'SmsController@deferedSms');
Route::get('/sent-single/{id}', 'SmsController@sentSingle');
Route::get('/pending-single/{id}', 'SmsController@deferedSingle');
Route::post('/export', 'SmsController@exportPhoneBook');
Route::get('/phonebook-single/{id}', 'SmsController@phonebookSingle');
Route::prefix('me2u')->group(function () {
    Route::get('/shared', 'SmsController@smsShared');
    Route::get('/tome', 'SmsController@smsReceived');
});
