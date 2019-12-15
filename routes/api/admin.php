<?php
Route::middleware(['auth', 'admin'])->group(function () {
    Route::prefix('users')->group(__DIR__ . '/admin/users.php');
    Route::prefix('payments')->group(__DIR__ . '/admin/payments.php');
    Route::get('/payment/{id}', 'AdminController@payment');
    Route::get('/user/{id}', 'AdminController@manageUser');
    Route::prefix('val')->group(__DIR__ . '/admin/validate.php');
    Route::prefix('sms')->group(__DIR__ . '/admin/sms.php');
    Route::prefix('quotes')->group(__DIR__ . '/admin/quotes.php');
    Route::prefix('tutorials')->group(__DIR__ . '/admin/tutorials.php');
});
