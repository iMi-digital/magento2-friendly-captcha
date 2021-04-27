<?php
/**
 *  Copyright © iMi digital GmbH, based on work by MageSpecialist
 *  See LICENSE for license details.
 */

namespace IMI\FriendlyCaptcha\Observer;

use Magento\Framework\App\Action\Action;
use Magento\Framework\Event\Observer;
use Magento\Framework\Event\ObserverInterface;
use IMI\FriendlyCaptcha\Api\ValidateInterface;
use IMI\FriendlyCaptcha\Model\IsCheckRequiredInterface;
use IMI\FriendlyCaptcha\Model\Provider\FailureProviderInterface;
use IMI\FriendlyCaptcha\Model\Provider\SolutionProviderInterface;

class FriendlyCaptchaObserver implements ObserverInterface
{

    /**
     * @var FailureProviderInterface
     */
    private $failureProvider;

    /**
     * @var ValidateInterface
     */
    private $validate;

    /**
     * @var SolutionProviderInterface
     */
    private $responseProvider;

    /**
     * @var IsCheckRequiredInterface
     */
    private $isCheckRequired;

    /**
     * @param SolutionProviderInterface $responseProvider
     * @param ValidateInterface $validate
     * @param FailureProviderInterface $failureProvider
     * @param IsCheckRequiredInterface $isCheckRequired
     */
    public function __construct(
        SolutionProviderInterface $responseProvider,
        ValidateInterface $validate,
        FailureProviderInterface $failureProvider,
        IsCheckRequiredInterface $isCheckRequired
    ) {
        $this->responseProvider = $responseProvider;
        $this->validate = $validate;
        $this->failureProvider = $failureProvider;
        $this->isCheckRequired = $isCheckRequired;
    }

    /**
     * @param Observer $observer
     *
     * @return void
     */
    public function execute(Observer $observer): void
    {
        if ($this->isCheckRequired->execute()) {
            $friendlyCaptchaResponse = $this->responseProvider->execute();

            if (!$this->validate->validate($friendlyCaptchaResponse)) {
                /** @var Action $controller */
                $controller = $observer->getControllerAction();
                $this->failureProvider->execute($controller ? $controller->getResponse() : null);
            }
        }
    }
}
