<?php
return [
    'max_age' => env("JWT_MAX_AGE", 60),
    'refresh_at' => env("JWT_REF_AT", 30),
    'secret' => env("JWT_SECRET", ''),
];
