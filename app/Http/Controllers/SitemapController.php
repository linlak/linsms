<?php

namespace App\Http\Controllers;

use App\CrawlablePage;
use App\Services\Traits\MyVariables;
use Illuminate\Http\Request;

class SitemapController extends Controller
{
    use MyVariables;
    //
    public function store(Request $request)
    {
        if (!is_null($request->json('page_url'))) {
            $c_page = CrawlablePage::where('page_url', $request->json('page_url'))->get()->first();
            if (!\is_null($c_page)) {
                $c_page->visists += 1;
            } else {
                $c_page = new CrawlablePage();
                $c_page->page_url = $request->json('page_url');
            }
            $c_page->page_freq = $request->json('page_freq');
            $c_page->crawler_priority = $request->json('crawler_priority');
            $c_page->save();
            $this->_setResults('status', 'done');
        }
        return $this->_showResult();
    }
    public function index()
    {
        $crawlable_pages = CrawlablePage::all();
        return view('sitemap.main', compact('crawlable_pages'));
    }
}
