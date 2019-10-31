<?php

namespace App\Http\Controllers;

use App\Services\Traits\EventSource;
use App\Services\Traits\MyVariables;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\StreamedResponse;

class SessChecker extends Controller
{
    use MyVariables, EventSource;
    public function __construct()
    {
        $this->middleware('auth');
        $this->userLocation();
    }

    public function checkLogin(Request $request)
    {
        \set_time_limit(0);

        ignore_user_abort(true);
        ob_start();
        $response = new StreamedResponse(function () use ($request) {
            $this->streamRetry();
            $id = time();
            while ($this->checkAbort()) {
                Auth::checkExpires();

                $user = [];
                $is_user = false;
                //refresh token
                //tokenstatus
                if (Auth::shouldRefresh()) { }
                if (!is_null($c_user = User::with(['admin', 'cur_pay.payment'])->withCount('unreadNotifications')->find(Auth::id()))) {
                    $user_role = 'user';
                    if (!is_null($c_user->admin)) {
                        if ($c_user->admin->admin_level === 'd') {
                            $user_role = "super";
                        } else {
                            $user_role = "admin";
                        }
                    }
                    $is_user = true;
                    $user = [
                        'name' => Str::title($c_user->fullname),
                        'email' => $c_user->email,
                        'status' => (int) $c_user->status,
                        'user_role' => $user_role,
                        'id' => encrypt($c_user->id),
                        'hook_id' => $c_user->id,
                        'has_sms' => $c_user->has_sms,
                        'sms_count' => $c_user->has_sms ? $c_user->cur_pay->payment->remaining
                            : 0,
                        'notifications' => $c_user->unread_notifications_count,
                        'isUsable' =>  $c_user->has_sms ? $c_user->cur_pay->is_active : false,
                        'reason' => $c_user->has_sms ? $c_user->cur_pay->reason : ''
                    ];
                }
                $user['isUser'] = $is_user;
                $this->sendMsg($id++, $user, 'loggedon');
                \sleep(15);
            }
        });
        $response->headers->set('Content-Type', 'text/event-stream');
        $response->headers->set('X-Accel-Buffering', 'no');
        $response->headers->set('Cache-Control', 'no-cache');
        return $response;
    }
    public function sessCheck(Request $request)
    {

        $user = [];
        $is_user = false;
        if (!is_null($c_user = User::with(['admin', 'cur_pay.payment'])->find(Auth::id()))) {
            $user_role = 'user';
            if (!is_null($c_user->admin)) {
                if ($c_user->admin->admin_level === 'd') {
                    $user_role = "super";
                } else {
                    $user_role = "admin";
                }
            }
            $is_user = true;
            $user = [
                'name' => Str::title($c_user->fullname),
                'email' => $c_user->email,
                'email_verified' => $c_user->hasVerifiedEmail(),
                'phone_verified' => !is_null($c_user->phone_verified_at),
                'status' => (int) $c_user->status,
                'user_role' => $user_role,
                'id' => encrypt($c_user->id),
                'has_sms' => $c_user->has_sms,
                'sms_count' => $c_user->has_sms ? $c_user->cur_pay->payment->remaining
                    : 0,
                'isUsable' =>  $c_user->has_sms ? $c_user->cur_pay->is_active : false,
                'reason' => $c_user->has_sms ? $c_user->cur_pay->reason : ''
            ];
        }
        $user['isUser'] = $is_user;
        $this->_setResults('user', $user);
        return $this->_showResult();
    }
}
