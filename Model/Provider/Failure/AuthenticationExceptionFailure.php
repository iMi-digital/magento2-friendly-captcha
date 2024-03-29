<?php
/**
 *  Copyright © iMi digital GmbH, based on work by MageSpecialist
 *  See LICENSE for license details.
 */

namespace IMI\FriendlyCaptcha\Model\Provider\Failure;

use Magento\Framework\App\Response\Http;
use Magento\Framework\Exception\Plugin\AuthenticationException;
use IMI\FriendlyCaptcha\Model\Config;
use IMI\FriendlyCaptcha\Model\Provider\FailureProviderInterface;

class AuthenticationExceptionFailure implements FailureProviderInterface
{
    /**
     * @var Config
     */
    private $config;

    /**
     * AuthenticationExceptionFailure constructor.
     * @param Config $config
     */
    public function __construct(
        Config $config
    ) {
        $this->config = $config;
    }

    /**
     * Handle friendlyCaptcha failure
     * @param Http $response
     * @return void
     * @throws AuthenticationException
     * @SuppressWarnings(PHPMD.UnusedFormalParameter)
     */
    public function execute(Http $response)
    {
        throw new AuthenticationException($this->config->getErrorDescription());
    }
}
