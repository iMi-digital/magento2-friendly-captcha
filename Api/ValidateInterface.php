<?php

namespace IMI\FriendlyCaptcha\Api;

interface ValidateInterface
{
    const PARAM_FRIENDLY_CAPTCHA_SOLUTION = 'frc-captcha-solution';

    /**
     * Return true if friendlyCaptcha validation has passed
     *
     * @param string $friendlyCaptchaSolution
     *
     * @return bool
     */
    public function validate(string $friendlyCaptchaSolution): bool;
}
