<?php
/**
 *  Copyright © iMi digital GmbH, based on work by MageSpecialist
 *  See LICENSE for license details.
 */

namespace IMI\FriendlyCaptcha\Api;

use IMI\FriendlyCaptcha\Model\Exception\InvalidSolutionException;

interface ValidateInterface
{
    const PARAM_FRIENDLY_CAPTCHA_SOLUTION = 'frc-captcha-solution'; // v1
    const PARAM_FRIENDLY_CAPTCHA_RESPONSE = 'frc-captcha-response'; // v2
    
    /**
     * Return true if friendlyCaptcha validation has passed
     *
     * @param string $friendlyCaptchaSolution The solution value that the user submitted in the `frc-captcha-solution` or `frc-captcha-response` field
     *
     * @return bool
     * @throws InvalidSolutionException
     * @throws \RuntimeException If the validator for the configured endpoint is not an instance of ValidateInterface
     */
    public function validate(string $friendlyCaptchaSolution): bool;
}
