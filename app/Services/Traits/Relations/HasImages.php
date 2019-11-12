<?php

namespace App\Services\Traits\Relations;

use App\Image;

/**
 * 
 */
trait HasImages
{
    public function images()
    {
        return $this->morphMany(Image::class, 'imageable');
    }
}
