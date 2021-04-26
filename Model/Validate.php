<?php
declare(strict_types=1);

namespace IMI\FriendlyCaptcha\Model;

use IMI\FriendlyCaptcha\Api\ValidateInterface;

class Validate implements ValidateInterface
{
    /**
     * @var Config
     */
    private $config;

    /**
     * Validate constructor.
     *
     * @param Config $config
     */
    public function __construct(
        Config $config
    ) {
        $this->config = $config;
    }

    /**
     * Return true if friendlyCaptcha validation has passed
     *
     * @param string $friendlyCaptchaResponse
     * @param string $remoteIp
     *
     * @return bool
     */
    public function validate($friendlyCaptchaResponse, $remoteIp)
    {
        //@TODO implement
        return false;
    }
}
