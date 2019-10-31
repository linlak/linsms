<?php
Route::get('/', function () {
    return 'it works';
});
Route::prefix('/domains')->group(function () {
    Route::get('/', 'WebAppsController@myDomains');
    Route::post('/store', 'WebAppsController@storeDomain');
    Route::post('/destory', 'WebAppsController@destroyDomain');
});
Route::get('/my-apps', 'WebAppsController@myApps');
Route::post('/create-app', 'WebAppsController@createApp');
Route::prefix('my-app/{id}')->group(function () {
    Route::get('', 'WebAppsController@appHome');
    Route::get('/edit', 'WebAppsController@appEdit');
    Route::get('/messages', 'WebAppsController@appMessages');
    Route::get('/message/{messageId}', 'WebAppsController@appMessage');
});
Route::prefix('/edit-app')->group(function () {
    Route::post('', 'WebAppsController@update');
    Route::post('/client-id', 'WebAppsController@editClientId');
    Route::post('/secret', 'WebAppsController@editSecret');

    Route::post('/sms', 'WebAppsController@editSmsApi');
    Route::post('/funds', 'WebAppsController@editFundsApi');
    Route::post('/payout', 'WebAppsController@editPayoutApi');
});
