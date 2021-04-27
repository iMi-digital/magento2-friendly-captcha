<?php

namespace IMI\FriendlyCaptcha\Model\Provider;

interface SolutionProviderInterface
{
    /**
     * Get Friendly Captcha solution from request
     *
     * @return string
     */
    public function execute(): string;
}
