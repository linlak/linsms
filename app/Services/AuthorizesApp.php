<?php

namespace App\Services;

use Illuminate\Http\Request;
use App\WebApi\WebApp;

trait AuthorizesApp
{
    use LogsApp;
    // use KeyTrait;
    /**
     * @var String
     */
    protected $userString = "";
    protected $client_id = "";
    protected $secret = "";
    /**
     * The header name.
     *
     * @var string
     */
    protected $header = 'authorization';

    /**
     * The header prefix.
     *
     * @var string
     */
    protected $prefix = 'basic';

    /**
     * Attempt to parse the token from some other possible headers.
     *
     * @param  \Illuminate\Http\Request  $request
     *
     * @return null|string
     */
    protected function fromAltHeaders(Request $request)
    {
        return $request->server->get('HTTP_AUTHORIZATION') ?: $request->server->get('REDIRECT_HTTP_AUTHORIZATION');
    }

    /**
     * Try to parse the token from the request header.
     *
     * @param  \Illuminate\Http\Request  $request
     *
     * @return null|string
     */
    public function parse(Request $request)
    {
        $header = $request->headers->get($this->header) ?: $this->fromAltHeaders($request);

        if ($header && preg_match('/' . $this->prefix . '\s*(\S+)\b/i', $header, $matches)) {
            return $matches[1];
        }
    }
    public function authKeys()
    {

        $client_id = $this->client_id;
        $secret = $this->secret;
        return \compact('client_id', 'secret');
    }
    private function getApp()
    {
        if ($this->userString = $this->parse($this->request)) {
            list($this->client_id, $this->secret) = \explode(':', \base64_decode($this->userString));
            if (!\is_null($this->client_id) && !\is_null($this->secret)) {
                $webapp = WebApp::with('user.cur_pay.payment')->where('client_id', '=', $this->client_id)->get()->first();
                if (!is_null($webapp)) {
                    if ($webapp->secret === $this->secret) {
                        $this->webApp = $webapp;
                        $this->setUser($this->webApp->user);
                    } else {
                        $this->app_log($webapp, "Authentication failed", "error");
                    }
                }
            }
        }
    }
}
