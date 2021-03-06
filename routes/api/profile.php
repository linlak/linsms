<?php
Route::get('', 'UserController@index')->name('profile');
Route::get('edit-data', 'UserController@editData')->name('profile-edit');
Route::post('edit-profile', 'UserController@editProfile')->name('profile-update');
Route::prefix('notifications')->group(function () {
    Route::match(['get', 'post',], '', 'UserController@getNotifications');
});
