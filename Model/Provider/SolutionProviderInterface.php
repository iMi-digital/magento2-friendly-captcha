<?php
/**
 *  Copyright © iMi digital GmbH, based on work by MageSpecialist
 *  See LICENSE for license details.
 */

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
