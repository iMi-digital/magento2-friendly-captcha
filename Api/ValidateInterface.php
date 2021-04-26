<?php

namespace IMI\FriendlyCaptcha\Api;

interface ValidateInterface
{
    const PARAM_RECAPTCHA_RESPONSE = 'g-friendly-captcha-response';

    /**
     * Return true if friendlyCaptcha validation has passed
     *
     * @param string $friendlyCaptchaResponse
     * @param string $remoteIp
     *
     * @return bool
     */
    public function validate($friendlyCaptchaResponse, $remoteIp);
}
