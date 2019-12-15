<?php

namespace App\Services\Traits\Admin\Tutorials;

use App\Tutorial;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

trait TutorialsCommons
{
    public function tutorials()
    {
        $output = [];
        $tutorials = Tutorial::with('admin.user')->withCount(['comments', 'likes'])->get();
        if ($tutorials->count() > 0) {
            foreach ($tutorials as $tutorial) {
                $output[] = $this->parseTut($tutorial);
            }
        }
        $this->_setResults('tutorials', $output);
        return $this->_showResult();
    }
    private function parseTut(Tutorial $tutorial)
    {
        return [
            'id' => $tutorial->id,
            'title' => $tutorial->title,
            'title_link' => $tutorial->title_link,
            'author' => [
                'name' => Str::title($tutorial->admin->user->fullname)
            ],
            'created_at' => $tutorial->created_at,
            'updated_at' => $tutorial->updated_at,
            'likes' => $tutorial->likes_count,
            'comments' => $tutorial->comments_count
        ];
    }
    private function parseTutDetails(Tutorial $tutorial)
    {
        return [
            'id' => $tutorial->id,
            'title' => $tutorial->title,
            'author' => [
                'name' => Str::title($tutorial->admin->user->fullname)
            ],
            'created_at' => $tutorial->created_at,
            'updated_at' => $tutorial->updated_at,
            'likes_count' => $tutorial->likes_count,
            'comments_count' => $tutorial->comments_count,
            'body' => $tutorial->body,
        ];
    }
    public function tutorial(Request $request, $id)
    {
        $output = [];
        try {
            $tutorial = Tutorial::with(['admin', 'comments', 'likes'])->withCount(['comments', 'likes'])->findOrFail($id);
            $output = $this->parseTutDetails($tutorial);
        } catch (\Throwable $th) {
            $e = $th->getMessage();
            $this->no_data('Tutorial not found!!');
        }
        $this->_setResults('tutorial', $output);
        return $this->_showResult();
    }
    public function tutorialLink(Request $request, $title_link)
    {
        $output = [];

        $tutorial = Tutorial::with(['admin', 'comments', 'likes'])->withCount(['comments', 'likes'])->where('title_link', $title_link)->get()->first();
        if (!is_null($tutorial)) {
            $output = $this->parseTutDetails($tutorial);
        } else {
            $this->no_data('Tutorial not found!!');
        }
        $this->_setResults('tutorial', $output);
        return $this->_showResult();
    }
}
