<?php
/**
 *  Copyright © iMi digital GmbH, based on work by MageSpecialist
 *  See LICENSE for license details.
 */

namespace IMI\FriendlyCaptcha\Model\Provider\Failure\RedirectUrl;

use Magento\Framework\App\Response\RedirectInterface;
use IMI\FriendlyCaptcha\Model\Provider\Failure\RedirectUrlProviderInterface;

/**
 * Class ReferrerUrlProvider
 *
 * @package IMI\FriendlyCaptcha\Model\Provider\Failure\RedirectUrl
 */
class ReferrerUrlProvider implements RedirectUrlProviderInterface
{

    /**
     * @var \Magento\Framework\App\Response\RedirectInterface
     */
    private $redirect;

    /**
     * ReferrerUrlProvider constructor.
     *
     * @param \Magento\Framework\App\Response\RedirectInterface $redirect
     */
    public function __construct(
        RedirectInterface $redirect
    ) {
        $this->redirect = $redirect;
    }

    /**
     * Get redirection URL
     *
     * @return string
     */
    public function execute()
    {
        return $this->redirect->getRefererUrl();
    }
}
