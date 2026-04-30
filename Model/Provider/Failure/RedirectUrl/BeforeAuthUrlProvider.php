<?php

/**
 *  Copyright © iMi digital GmbH, based on work by MageSpecialist
 *  See LICENSE for license details.
 */

namespace IMI\FriendlyCaptcha\Model\Provider\Failure\RedirectUrl;

use IMI\FriendlyCaptcha\Model\Provider\Failure\RedirectUrlProviderInterface;
use Magento\Customer\Model\Url;
use Magento\Framework\Session\SessionManagerInterface;

class BeforeAuthUrlProvider implements RedirectUrlProviderInterface
{
    /**
     * @var SessionManagerInterface
     */
    private $sessionManager;

    /**
     * @var Url
     */
    private $url;

    /**
     * BeforeAuthUrlProvider constructor.
     *
     * @param SessionManagerInterface $sessionManager
     * @param Url $url
     */
    public function __construct(
        SessionManagerInterface $sessionManager,
        Url $url
    ) {
        $this->sessionManager = $sessionManager;
        $this->url = $url;
    }

    /**
     * Get redirection URL
     *
     * @return string
     */
    public function execute()
    {
        $beforeUrl = $this->sessionManager->getBeforeAuthUrl();

        return $beforeUrl ?: $this->url->getLoginUrl();
    }
}
