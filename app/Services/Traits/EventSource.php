<?php
namespace App\Services\Traits;

trait EventSource
{

    final public function sendMsg($id, $msg, $event = "")
    {

        if (!is_array($msg)) {
            $msg = array('msg' => $msg);
        }

        if ($event !== "") {
            echo "event: $event\n";
        }
        echo "id:$id\n";
        echo "data:" . json_encode($msg) . PHP_EOL . PHP_EOL;
        echo PHP_EOL;
        $this->flushBuffers();
    }
    final public function flushBuffers()
    {
        ob_end_flush();
        ob_flush();
        flush();
        ob_start();
    }
    final public function  streamRetry()
    {
        echo 'retry: 1000\n';
        $this->flushBuffers();
    }
    final public function checkAbort()
    {
        return true;
        if (connection_aborted()) {
            header("Content-Type: text/plain");
            echo ("hi bye");
            exit();
        }
        return true;
    }
}
