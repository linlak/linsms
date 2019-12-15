<?php

namespace App\Services\Traits\Admin\Tutorials;

use App\Tutorial;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

trait TutorialsTrait
{
    use TutorialsCommons;

    protected function createTutorial(Request $request)
    {
        $this->_validator = Validator::make($request->all(), [
            'title' => ['required', 'string']
        ]);
        if ($this->_validator->fails()) {
            return $this->getErrs();
        }
        $tutorial = new Tutorial();
        $tutorial->title = $request->input('title');
        $tutorial->title_link = Str::slug($tutorial->title);
        $tutorial->admin_id = auth()->user()->admin->id;
        $tutorial->save();
        $tutorial->refresh();
        $this->_success_flag = 1;
        $this->_msg = "Tutorial created successfully :)";
        $this->_type = "success";
        $this->_setResults('tutorial', $tutorial->id);
    }
}
