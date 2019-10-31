<?php

namespace App\Services\Traits\Admin\Quotes;

use App\Events\NewQuote;
use App\Quote;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

/**
 * 
 */
trait QuotesTrait
{
    private function parseQuote(Quote $quote)
    {
        return  [
            'id' => $quote->id,
            'body' => Str::ucfirst($quote->body),
            'views' => 0,
            'comments' => 0,
            'is_published' => false,
            'author' => [
                'name' => Str::title($quote->user->fullname)
            ]
        ];
    }
    public function getQuotes()
    {
        $output = [];
        $quotes = Quote::with('user')->latest('updated_at')->get();
        if ($quotes->count() > 0) {
            foreach ($quotes as $quote) {
                $output[] = $this->parseQuote($quote);
            }
        }
        $this->_setResults('quotes', $output);
        return $this->_showResult();
    }

    public function createEditQuote(Request $request)
    {
        $this->_enVal();
        switch ($request->input('action')) {
            case 'create':
                $this->createQuote($request);
                break;
            default:
                $this->_msg = "Action not yet implemented";
                $this->_type = 'info';
        }
        return $this->_showResult();
    }
    private function createQuote(Request $request)
    {
        if ($this->valQuote($request)) {
            $quote = new Quote();
            $quote->user_id = $request->user()->id;
            $quote->body = $request->input('body');
            $quote->save();

            $quote->refresh()->with('user');
            $this->_setResults('quote', $this->parseQuote($quote));
            $this->_success_flag = 1;
            $this->_type = 'success';
            $this->_msg = "Quote created successfully :)";
            broadcast(new NewQuote($quote));
        }
    }
    private function valQuote(Request $request)
    {
        $this->_validator = Validator::make($request->all(), [
            'body' => 'required',
        ], [], [
            'body' => 'quote'
        ]);
        if ($this->_validator->fails()) {
            $this->getErrs();
            return false;
        }
        return true;
    }
    public function comments()
    { }

    public function views()
    { }
}
