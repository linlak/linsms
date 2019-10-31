<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|composer require genealabs/laravel-model-caching
*/

use BeyondCode\LaravelWebSockets\WebSockets\Channels\ChannelManager;
use Illuminate\Http\Request;

Route::get('/sitemap.xml', 'SitemapController@index');
Route::get('/rss.xml', 'MainController@showRss');
Route::match(['post', 'get'], '/me', function (Request $request) {
    // return parse_url($request->input('host_name'));
    // if ($tags = get_meta_tags('http://localhost')) {
    //     if (isset($tags['linsms-site-verification'])) {
    //         return $tags['linsms-site-verification'];
    //     }
    // }
    // return 'not found';
    return app(ChannelManager::class)->getConnectionCount('1');
});
Route::get('/{any}', function (Request $request) {
    if ($request->expectsJson()) {
        return response()->json(['status' => 404, 'message' => 'Resource not found'], 404);
    }
    return view('home');
})->where('any', '.*');

// Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');
