<?php

namespace App\Services\Traits\Relations;

use App\Admin;

/**
 * 
 */
trait HasAdmin
{
    public function admin()
    {
        return $this->belongsTo(Admin::class, 'admin_id', 'id');
    }
}
