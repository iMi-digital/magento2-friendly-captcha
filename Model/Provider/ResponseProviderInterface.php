<?php

namespace IMI\FriendlyCaptcha\Model\Provider;

interface ResponseProviderInterface
{
    /**
     * Handle friendlyCaptcha failure
     *
     * @return string
     */
    public function execute();
}
