<?php

namespace IMI\FriendlyCaptcha\Model\Exception;

class InvalidSolutionException extends \Exception
{
    protected array $response;

    public function __construct(array $response, string $message = 'Error validating captcha solution.', int $code = 0, ?Throwable $previous = null)
    {
        $this->response = $response;
        parent::__construct($message, $code, $previous);
    }

    public function getResponse(): array
    {
        return $this->response;
    }
}