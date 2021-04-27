<?php
/**
 *  Copyright © iMi digital GmbH, based on work by MageSpecialist
 *  See LICENSE for license details.
 */

namespace IMI\FriendlyCaptcha\Model\Provider;

use Magento\Framework\App\ResponseInterface;

interface FailureProviderInterface
{
    /**
     * Handle friendlyCaptcha failure
     *
     * @param ResponseInterface|null $response
     *
     * @return void
     */
    public function execute(ResponseInterface $response = null);
}
