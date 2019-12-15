<?php
Route::get('/', 'AdminController@tutorials');
Route::get('/{id}', 'AdminController@tutorial');
