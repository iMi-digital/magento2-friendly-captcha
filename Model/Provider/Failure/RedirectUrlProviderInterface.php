<?php
/**
 *  Copyright © iMi digital GmbH, based on work by MageSpecialist
 *  See LICENSE for license details.
 */

namespace IMI\FriendlyCaptcha\Model\Provider\Failure;

interface RedirectUrlProviderInterface
{
    /**
     * Get redirection URL
     * @return string
     */
    public function execute();
}
