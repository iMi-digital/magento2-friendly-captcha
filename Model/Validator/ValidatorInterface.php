<?php

namespace IMI\FriendlyCaptcha\Model\Validator;

use IMI\FriendlyCaptcha\Model\Exception\InvalidSolutionException;

interface ValidatorInterface
{
    /**
     * Validate friendlyCaptcha solution.
     *
     * @param string $solution The solution value that the user submitted in the `frc-captcha-solution` field
     * @return bool Return true if friendlyCaptcha validation has passed.
     * @throws InvalidSolutionException
     */
    public function validate(string $solution): bool;
}