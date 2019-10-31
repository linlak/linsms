<?php

namespace App\Services\Traits\Sms;

use App\Phonebook;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

trait CreatesPhoneBook
{
    public function valPhonebook(Request $request)
    {
        $this->_enVal();
        switch ($request->input('action')) {
            case 'create':
                $this->createPhonebook($request);
                break;
            case 'edit':
                $this->editPhoneBook($request);
                break;
            case 'delete':
                $this->destroyPhonebook($request);
                break;
            case 'add':
                $this->addNumbers($request);
                break;
            default:
                $this->_msg = "Unknown call inform administrator";
        }
        return $this->_showResult();
    }

    private function createPhonebook(Request $request)
    {
        $this->_validator = Validator::make($request->all(), [
            'title' => 'required|string'
        ]);
        if ($this->_validator->fails()) {
            $this->_setResults('errs', $this->_validator->errors());
            return;
        }
        $group = new Phonebook();
        $group->title = $request->input('title');
        $group->user_id = $request->user()->id;
        $group->save();
        $this->_msg = "Group Added to phonebook successfully :)";
        $this->_type = 'success';
        $this->_success_flag = 1;
    }

    private function editPhoneBook(Request $request)
    {
        $id = \decrypt($request->input('id'));
        try {
            $group = Phonebook::where('user_id', '=', $request->user()->id)->findOrFail((int) $id);

            $group->title = $request->input('title');
            $group->save();

            $this->_msg = "Group editted successfully :)";
            $this->_type = "success";
            $this->_success_flag = 1;
        } catch (\Exception $e) {

            $this->_msg = "Group not found (:";
            return;
        }
    }
    private function addNumbers(Request $request)
    {
        $id = \decrypt($request->input('id'));
        try {
            $group = Phonebook::where('user_id', '=', $request->user()->id)->findOrFail((int) $id);
            if ($contacts = $request->input('contacts')) {
                $nos = $this->cleanContacts($contacts);
                if ($nos) {
                    $group->contacts = \join(',', $nos);
                }
            }
            $group->save();

            $this->_msg = "Contacts added to Group Successfully :)";
            $this->_type = "success";
            $this->_success_flag = 1;
        } catch (\Exception $e) {

            $this->_msg = "Group not found (:";
            return;
        }
    }

    private function destroyPhonebook(Request $request)
    {
        $id = $request->input('id');

        try {
            $ids = [];
            if (is_array($id)) {
                for ($i = 0; $i < count($id); $i++) {
                    $ids[] = (int) decrypt($id[$i]);
                }
            } else {
                $ids[] = (int) decrypt($id);
            }
            if (!$ids) {
                return;
            }

            if ($groups = Phonebook::where('user_id', '=', $request->user()->id)->whereIn('id', $ids)->get()) {

                foreach ($groups as $group) {
                    $group->delete();
                }
                $plr = (is_array($id)) ? 's' : '';
                $this->_msg = "Phonebook Group" . $plr . " deleted successfully";
                $this->_type = "success";
                $this->_success_flag = 1;
            } else {
                $plr = (is_array($id)) ? 's' : '';
                $this->_msg = "Group" . $plr . " not found (:";
            }
        } catch (\Exception $e) {

            $this->_msg = "Group not found (:";
            return;
        }
    }
}
