<?php

use Illuminate\Http\Request;

Route::get('gallery', 'MainController@gallery');
Route::post('easy', 'WebhookController@easyPay');
Route::get('easy-test', 'HomeController@testPayment');
Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});
Route::post('/page_stats', 'SitemapController@store');
Route::prefix('sms')->group(__DIR__ . '/api/sms.php');
Route::prefix('main')->group(__DIR__ . '/api/main.php');

Route::middleware('auth')->prefix('profile')->group(__DIR__ . '/api/profile.php');
Route::middleware('auth')->prefix('administration')->group(__DIR__ . '/api/admin.php');
Auth::routes();
Route::post('/rights', 'Auth\LoginController@rights')->name('rights');
Route::middleware('refresh')->get('/refresh', 'Auth\LoginController@refresh')->name('ref_token');
Route::get('/sesscheck', 'SessChecker@checkLogin')->name('sesscheck');
Route::match(['get', 'post'], '/checklogin', 'SessChecker@sessCheck')->name('checklogin');
Route::post('/verification-code', 'Auth\VerificationController@verCode');
