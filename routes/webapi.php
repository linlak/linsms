<?php
Route::namespace('WebApi')
    ->group(function () {
        Route::middleware(['sms_enabled', 'hassms'])
            ->group(function () {
                Route::get('balance', 'ApiController@balance');
                Route::post('send', 'ApiController@send');
                Route::get('sms-status/{id}', 'ApiController@sentStatus');
            });
        Route::prefix('/payments')
            ->middleware(['funds_enabled'])
            ->group(function () {
                Route::get('/balance', 'PaymentsController@balance');
                Route::prefix('/deposit')
                    ->group(function () {
                        Route::post('', 'PaymentsController@deposit');
                        Route::get('/status/{id}', 'PaymentsController@depositStatus');
                    });
                Route::prefix('/payout')
                    ->middleware(['payout_enabled'])
                    ->group(function () {
                        Route::post('', 'PaymentsController@payout');
                        Route::get('/status/{id}', 'PaymentsController@payoutStatus');
                    });
            });
    });
