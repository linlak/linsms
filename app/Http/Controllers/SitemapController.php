<?php

namespace App\Http\Controllers;

use App\CrawlablePage;
use Illuminate\Http\Request;
use App\Services\Traits\MyVariables;

class SitemapController extends Controller
{
    use MyVariables;
    //
    public function store(Request $request)
    {
        if (!is_null($request->input('page_url'))) {
            $c_page = CrawlablePage::where('page_url', $request->input('page_url'))->get()->first();
            if (!\is_null($c_page)) {
                $c_page->visists += 1;
                $c_page->page_freq = $request->input('page_freq');
                $c_page->crawler_priority = $request->input('crawler_priority');
            } else {
                $c_page = new CrawlablePage($request->only('page_url', 'crawler_priority', 'page_freq'));
            }
            $c_page->save();
        }
        return $this->_showResult();
    }
    public function index()
    {
        $crawlable_pages = CrawlablePage::all();
        return view('sitemap.main', compact('crawlable_pages'));
    }
}
