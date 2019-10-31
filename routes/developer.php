<?php

Route::prefix('tutorials')->namespace('WebApi')->group(__DIR__ . '/developer/tutorials.php');
Route::middleware('auth')->namespace('WebApi')->prefix('console')->group(__DIR__ . '/developer/console.php');
