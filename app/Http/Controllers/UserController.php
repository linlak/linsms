<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\Traits\MyVariables;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;
use App\User;
use App\Notifications\ProfileUpdated;

class UserController extends Controller
{
    use MyVariables;
    public function __construct()
    {
        $this->middleware(['auth']);
        $this->userLocation();
    }
    public function index(Request $request)
    {
        $user = $request->user();
        $this->_setResults('user', [
            'fullname' => Str::title($user->fullname),
            'email' => $user->email,
            'phone' => $user->phone,
            'username' => $user->username,
            'gender' => Str::ucfirst($user->gender),
            'created_at' => $user->created_at->copy()->timezone($this->my_location->getAttribute('timezone'))->toDayDateTimeString(),
            'country' => $user->country ? Str::ucfirst($user->country) : '',
        ]);
        return $this->_showResult();
    }

    public function editData(Request $request)
    {
        $user = $request->user();
        $this->_setResults('user', [
            'fullname' => $user->fullname,
            'gender' => $user->gender,
            'country' => $user->country ?: ''
        ]);
        return $this->_showResult();
    }

    public function editProfile(Request $request)
    {
        $this->_enVal();
        $this->_validator = Validator::make($request->all(), [
            'fullname' => 'required|string',
            'gender' => 'required|string',
            'country' => 'required|string'
        ]);
        if (!$this->_validator->fails()) {
            $user = User::find(\auth()->id());
            $user->fullname = $request->input('fullname');
            $user->gender = $request->input('gender');
            $user->country = $request->input('country');
            $user->save();
            $user->refresh();
            $user->notify((new ProfileUpdated)->delay(\now()->addSeconds(30)));
            $this->_success_flag = 1;
            $this->_type = "success";
            $this->_msg = "Your changes have been saved successfully";
        } else {
            $this->getErrs();
        }
        return $this->_showResult();
    }
}
