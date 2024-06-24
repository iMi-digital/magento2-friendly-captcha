<?php

namespace IMI\FriendlyCaptcha\Plugin\Model\Magewire\Payment;

use Hyva\Checkout\Model\Magewire\Payment\AbstractPlaceOrderService;
use IMI\FriendlyCaptcha\Api\ValidateInterface;
use Magento\Quote\Model\Quote;

class CaptchaValidation
{

    public function __construct(private readonly ValidateInterface $validate)
    {
    }

    public function beforePlaceOrder(AbstractPlaceOrderService $subject, Quote $quote): void
    {
        $solution = $subject->getData()->getData(ValidateInterface::PARAM_FRIENDLY_CAPTCHA_SOLUTION);
        if (!$this->validate->validate($solution)) {
            throw new \Exception('Invalid Captcha.');
        }
    }
}
