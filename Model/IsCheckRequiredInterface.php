<?php

namespace IMI\FriendlyCaptcha\Model;

interface IsCheckRequiredInterface
{
    /**
     * Return true if check is required
     *
     * @return bool
     */
    public function execute(): bool;
}
