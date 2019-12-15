<?php

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

use App\WebApi\WebApp;

Broadcast::channel('App.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
}, ['guards' => ['api']]);
Broadcast::channel('WebApps.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
}, ['guards' => ['api']]);
Broadcast::channel('lin', function () {
    return true;
});

//webapp channels
Broadcast::channel('WebApp.Stats.{id}', function ($user, $id) {
    $web_app = WebApp::with("user")->find($id);
    if (!is_null($web_app)) {
        return $user->is($web_app->user);
    }
    return false;
}, ['guards' => ['api']]);

Broadcast::channel('WebApp.Sms.{id}', function ($user, $id) {
    $web_app = WebApp::with("user")->find($id);
    if (!is_null($web_app)) {
        return $user->is($web_app->user);
    }
    return false;
}, ['guards' => ['api']]);

Broadcast::channel('WebApp.Settings.{id}', function ($user, $id) {
    $web_app = WebApp::with("user")->find($id);
    if (!is_null($web_app)) {
        return $user->is($web_app->user);
    }
    return false;
}, ['guards' => ['api']]);

Broadcast::channel('WebApp.Home.{id}', function ($user, $id) {
    $web_app = WebApp::with("user")->find($id);
    if (!is_null($web_app)) {
        return $user->is($web_app->user);
    }
    return false;
}, ['guards' => ['api']]);

Broadcast::channel('WebApp.Edit.{id}', function ($user, $id) {
    $web_app = WebApp::with("user")->find($id);
    if (!is_null($web_app)) {
        return $user->is($web_app->user);
    }
    return false;
}, ['guards' => ['api']]);
Broadcast::channel('WebApp.Hooks.{id}', function ($user, $id) {
    $web_app = WebApp::with("user")->find($id);
    if (!is_null($web_app)) {
        return $user->is($web_app->user);
    }
    return false;
}, ['guards' => ['api']]);

Broadcast::channel('admin', function ($user) {
    return (!is_null($user->admin));
}, ['guards' => ['api']]);

Broadcast::channel('admin.apps', function ($user) {
    return (!is_null($user->admin));
}, ['guards' => ['api']]);

Broadcast::channel('admin.users', function ($user) {
    return (!is_null($user->admin));
}, ['guards' => ['api']]);
