<?php

namespace App;

use App\Services\Traits\Relations\HasAdmin;
use App\Services\Traits\Relations\HasComments;
use App\Services\Traits\Relations\HasLikes;
use Illuminate\Database\Eloquent\Model;

class Tutorial extends Model
{
    use HasComments, HasLikes, HasAdmin;
    protected $casts = ['is_visible' => 'boolean'];
    protected $fillable = [
        'body', 'admin_id', 'title', 'title_link', 'is_visible'
    ];
}
