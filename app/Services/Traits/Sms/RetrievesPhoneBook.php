<?php

namespace App\Services\Traits\Sms;

use Illuminate\Http\Request;
use App\Phonebook;
use App\User;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Illuminate\Support\Str;

trait RetrievesPhoneBook
{

    public function phonebook(Request $request)
    {
        $groups = [];
        $user = User::with(['phonebooks' => function ($query) {
            $query->orderBy('updated_at', 'DESC');
        }])->find($request->user()->id);
        if (count($user->phonebooks)) {
            for ($i = 0; $i < count($user->phonebooks); $i++) {
                $contact = $user->phonebooks[$i];
                $contacts = 0;
                // if (!is_null($contact->contacts)) {

                $contacts = count($this->cleanContacts($contact->contacts));
                // }
                $groups[] = [
                    'id' => encrypt($contact->id),
                    'title' => $contact->title,
                    'created' => $contact->created_at->copy()->timezone($this->my_location->getAttribute('timezone'))->toDayDateTimeString(),
                    'chanel_id' => $contact->id,
                    'last_updated' => $contact->updated_at->copy()->timezone($this->my_location->getAttribute('timezone'))->toDayDateTimeString(),
                    'contacts' => $contacts
                ];
            }
        }
        $this->_setResults('groups', $groups);
        return $this->_showResult();
    }
    public function exportPhoneBook(Request $request)
    {
        try {
            $id =
                $phonebook = Phonebook::findOrFail((int) \decrypt($request->input('id')));
            $response = new StreamedResponse(function () use ($phonebook) {

                $handle = \fopen('php://output', 'w');
                \fputs($handle, "This file contains contacts exported from your phonebook.\n\r");
                \fputs($handle, "----------------------------------------------\n\r");
                $nos = $this->cleanContacts($phonebook->contacts);
                \fputs($handle, "Title: \t" . Str::title($phonebook->title) . "\t No of Contacts:\t" . \count($nos) . " .\n\r");
                \fputs($handle, "Contacts:\n\r");


                if ($nos) {
                    $lines = \join(", \n", $nos);
                    // for ($i = 0; $i < \count($nos); $i++) {
                    \fputs($handle, $lines, Str::length($lines));
                    // }
                }
                fclose($handle);
            }, 200, ['Content-type' => 'text/plain', 'Content-Disposition' => 'attachment;filename="' . Str::slug($phonebook->title . '_' . \date('Y-m-d H-i-s'), '_') . '.txt"']);
            return $response;
        } catch (\Exception $e) {
            $this->_enVal();
            $this->_msg = "No Data found (:";
            $this->_showToast();
            $this->_enVal();
            return $this->_showResult();
        }
    }
    public function phonebookSingle(Request $request, $id)
    {
        $id = \decrypt($id);
        $group = [];
        if ($fd = Phonebook::where('user_id', '=', $request->user()->id)->find($id)) {
            $nos = [];
            // if (!is_null($fd->contacts)) {
            $nos = $this->cleanContacts($fd->contacts);
            // }
            $group = [
                'title' => $fd->title,
                'created' => $fd->created_at->copy()->timezone($this->my_location->getAttribute('timezone'))->toDayDateTimeString(),
                'last_updated' => $fd->updated_at->copy()->timezone($this->my_location->getAttribute('timezone'))->toDayDateTimeString(),
                'id' => \encrypt($fd->id),
                'chanel_id' => $fd->id,
                'contacts' => $nos
            ];
        }

        $this->_setResults('group', $group);
        return $this->_showResult();
    }
}
