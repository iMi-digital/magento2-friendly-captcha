<?php
/**
 *  Copyright © iMi digital GmbH, based on work by MageSpecialist
 *  See LICENSE for license details.
 */

namespace IMI\FriendlyCaptcha\Model\Provider\Failure\RedirectUrl;

use IMI\FriendlyCaptcha\Model\Provider\Failure\RedirectUrlProviderInterface;
use Magento\Framework\App\Response\RedirectInterface;

class RefererProvider implements RedirectUrlProviderInterface
{
    /**
     * @var RedirectInterface
     */
    private $redirect;
    
    /**
     * RefererProvider constructor.
     * @param RedirectInterface $redirect
     */
    public function __construct(
        RedirectInterface $redirect
    ) {
        $this->redirect = $redirect;
    }

    /**
     * Get redirection URL
     * @return string
     */
    public function execute()
    {
        return $this->redirect->getRedirectUrl();
    }
}
