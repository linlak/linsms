<?php
Route::get('/', 'DevelopersController@tutorials');
// Route::get('/{id}', 'DevelopersController@tutorial');
Route::get('/{title_link}', 'DevelopersController@tutorialLink');
