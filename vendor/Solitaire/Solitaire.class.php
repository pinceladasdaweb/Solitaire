<?php
namespace Solitaire;

class Solitaire extends \Codebird\Codebird
{
    private $_tweet;
    private $_consumer_key        = CONSUMER_KEY;
    private $_consumer_secret     = CONSUMER_SECRET;
    private $_access_token        = ACCESS_TOKEN;
    private $_access_token_secret = ACCESS_TOKEN_SECRET;

    public function __construct($tweet)
    {
        $this->_tweet = $tweet;
    }

    public function status($reply)
    {
        $httpStatus = $reply->httpstatus;

        if ($httpStatus === 200) {
            $status = 'success';
            $message = 'Amazing, your tweet has been successfully posted on your timeline.';
        } else {
            $status = 'error';
            $message = $reply->errors[0]->message;
        }

        $data = array(
            'status'  => $status,
            'message' => $message
        );

        return $data;
    }

    public function post()
    {
        parent::setConsumerKey($this->_consumer_key, $this->_consumer_secret);

        $cb = parent::getInstance();
        $cb->setToken($this->_access_token, $this->_access_token_secret);

        $params = [
            'status' => $this->_tweet
        ];

        $reply = $cb->statuses_update($params);

        $httpStatus = $this->status($reply);

        echo json_encode($httpStatus);
    }
}
