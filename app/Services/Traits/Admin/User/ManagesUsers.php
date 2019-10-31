<?php

namespace App\Services\Traits\Admin\User;

use App\User;
use Illuminate\Support\Str;

trait ManagesUsers
{
    public function allUsers()
    {
        $users = [];

        $fd = User::get();
        if ($fd->count() > 0) {
            foreach ($fd as $user) {
                $users[] = [
                    'id' => encrypt($user->id),
                    'chanel_id' => $user->id,
                    'full_name' => Str::title($user->fullname),
                    'username' => $user->username,
                    'status' => $user->status,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'reg_date' => $user->created_at->copy()->timezone($this->my_location->getAttribute('timezone'))->toDayDateTimeString(),
                    'last_seen' => $user->updated_at->copy()->timezone($this->my_location->getAttribute('timezone'))->toDayDateTimeString(),
                ];
            }
        }
        $this->_setResults('users', $users);
        return $this->_showResult();
    }
}
