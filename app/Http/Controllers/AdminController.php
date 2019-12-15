<?php

namespace App\Http\Controllers;

use App\ActivationCode;
use App\Events\UserCreated;
use App\Me2U;
use App\Services\Traits\Admin\Quotes\QuotesTrait;
use App\Services\Traits\Admin\Sms\ActivatesPayments;
use App\Services\Traits\Admin\Sms\ManagesSms;
use App\Services\Traits\Admin\Tutorials\TutorialsTrait;
use App\Services\Traits\Admin\User\ManagesUsers;
use App\Services\Traits\MyVariables;
use App\Sms;
use App\Tutorial;
use App\User;
use DOMDocument;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class AdminController extends Controller
{
    use MyVariables, ActivatesPayments, ManagesUsers, ManagesSms, QuotesTrait, TutorialsTrait;

    public function __construct()
    {
        $this->middleware(['auth', 'admin']);
        $this->userLocation();
    }
    public function editTutorialBody(Request $request)
    {
        $this->_validator = Validator::make($request->all(), [
            'body' => 'nullable'
        ]);
        if ($this->_validator->fails()) {
            return $this->getErrs();
        }
        try {
            /**
             * @var \App\Tutorial
             */
            $tutorial = Tutorial::with(['admin', 'comments', 'likes'])->withCount(['comments', 'likes'])->findOrFail($request->input('id'));
            $this->_setResults('bb', $request->body);
            $tutubody = $request->input('body');
            $dom = new DOMDocument("1.0", "UTF-8");
            $dom->loadHTML($tutubody);
            $tutubody = $dom->saveHTML();

            $tutorial->body = $tutubody;
            $tutorial->save();
            // $tutorial->refresh()->with(['admin', 'comments', 'likes'])->withCount(['comments', 'likes']);
            $this->_setResults('tutorial', $this->parseTutDetails($tutorial));
            $this->_success_flag = 1;
            $this->_type = 'success';
            $this->_msg = "Tutorial updated successfully :)";
        } catch (\Throwable $th) {
            $e = $th->getMessage();
            $this->no_data('Tutorial not found!!');
        }
    }
    public function createEditTutorial(Request $request)
    {
        $this->_enVal();
        switch ($request->input('action', 'create')) {
            case 'create':
                $this->createTutorial($request);
                break;
            case 'edit-body':
                $this->editTutorialBody($request);
                break;
            default:
                $this->_msg = 'Action not implemented';
                break;
        }
        return $this->_showResult();
    }
    public function manageUser(Request $request, $id)
    {
        try {
            $user = User::with('admin')->findOrFail((int) \decrypt($id));
            $this->passUser($user);
        } catch (\Exception $e) { }

        return $this->_showResult();
    }

    public function valUser(Request $request)
    {
        $this->_enVal();
        $this->perform_user_val($request);
        return $this->_showResult();
    }

    private function passUser(User $user)
    {
        $this->_setResults('user', [
            'id' => \encrypt($user->id),
            'full_name' => Str::title($user->fullname),
            'email' => $user->email,
            'phone' => $user->phone,
            'gender' => Str::ucfirst($user->gender),
            'status' => $user->status,
            'username' => $user->username,
            'country' => $user->country,
            'reg_date' => $user->created_at->copy()->timezone($this->my_location->getAttribute('timezone'))->toDayDateTimeString(),
            'last_seen' => (!is_null($user->last_seen)) ? $user->last_seen->copy()->timezone($this->my_location->getAttribute('timezone'))->toDayDateTimeString() : $user->created_at->copy()->timezone($this->my_location->getAttribute('timezone'))->toDayDateTimeString(),
            'mbr' => $user->created_at->copy()->timezone($this->my_location->getAttribute('timezone'))->timespan(),
        ]);
    }

    private function perform_user_val(Request $request)
    {
        try {
            $user = User::with('admin')
                ->findOrFail((int) \decrypt($request->input('id')));
            // $this->passUser($user);
            switch ($request->input('action')) {
                case 'notify':
                    if ($user->status === '0') {

                        $actCode = ActivationCode::where('code_type', 'activation')->where('user_id', $user->id)->get()->first();
                        // $this->_msg = 'notify';
                        if (is_null($actCode)) {
                            $actCode = new ActivationCode();
                            $actCode->user_id = $user->id;
                            $vCode = Str::random(6);
                            while (ActivationCode::where('v_code', '=', $vCode)->get()->count()) {
                                $actCode = Str::random(6);
                            }
                            $actCode->v_code = $vCode;
                            $actCode->code_type = 'activation';
                            $actCode->notification_type = 'email';
                        }
                        $actCode->expires_at = (Date::now())->addHours(24);
                        $actCode->save();
                        event(new UserCreated($actCode));
                        $this->_msg = 'Activation code has been sent successfully';
                        $this->_type = "success";
                        $this->_success_flag = 1;
                    } else {
                        $this->_msg = Str::title($user->fullname) . ' is already active';
                        $this->_type = "warning";
                        $this->_success_flag = 1;
                    }
                    break;
                case 'suspend':
                    if ($user->status === '1') {
                        $user->status = '2';
                        $user->save();
                        $this->_msg = 'User account has been suspended successfully :)';
                        $this->_type = "success";
                        $this->_success_flag = 1;
                    }
                    break;
                case 'enable':
                    if ($user->status === '2') {
                        $user->status = '1';
                        $user->save();
                        $this->_msg = 'User account has been reactivated successfully';
                        $this->_type = "success";
                        $this->_success_flag = 1;
                    }
                    break;
                case 'del':
                    if ($user->status !== '9') { }
                    break;

                default:
                    $this->_msg = 'Unknown method';
                    break;
            }
        } catch (\Exception $e) { }
    }
}
