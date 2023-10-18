<?php
/**
 *  Copyright © iMi digital GmbH, based on work by MageSpecialist
 *  See LICENSE for license details.
 */

namespace IMI\FriendlyCaptcha\Model\Provider;

use Magento\Framework\App\Response\Http;
use Magento\Framework\App\ResponseInterface;

interface FailureProviderInterface
{
    /**
     * Handle friendlyCaptcha failure
     *
     * @param Http $response
     *
     * @return void
     */
    public function execute(Http $response);
}
