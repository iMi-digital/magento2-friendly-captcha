<?php

namespace IMI\FriendlyCaptcha\Block\LayoutProcessor\Checkout;

use Magento\Checkout\Block\Checkout\LayoutProcessorInterface;
use Magento\Framework\App\ObjectManager;
use IMI\FriendlyCaptcha\Model\Config;
use IMI\FriendlyCaptcha\Model\LayoutSettings;

class Onepage implements LayoutProcessorInterface
{
    /**
     * @var LayoutSettings
     */
    private $layoutSettings;

    /**
     * @var Config
     */
    private $config;

    /**
     * Onepage constructor.
     *
     * @param LayoutSettings $layoutSettings
     * @param Config|null $config
     */
    public function __construct(
        LayoutSettings $layoutSettings,
        Config $config = null
    ) {
        $this->layoutSettings = $layoutSettings;
        $this->config = $config ?: ObjectManager::getInstance()->get(Config::class);
    }

    /**
     * Process js Layout of block
     *
     * @param array $jsLayout
     * @return array
     */
    public function process($jsLayout)
    {
        if ($this->config->isEnabledFrontend()) {
            $jsLayout['components']['checkout']['children']['steps']['children']['shipping-step']['children']
                ['shippingAddress']['children']['customer-email']['children']
                ['imi_friendly_captcha']['settings'] = $this->layoutSettings->getCaptchaSettings();

            $jsLayout['components']['checkout']['children']['authentication']['children']
                ['imi_friendly_captcha']['settings'] = $this->layoutSettings->getCaptchaSettings();
        }

        if (!$this->config->isEnabledFrontend()) {
            if (isset($jsLayout['components']['checkout']['children']['steps']['children']['shipping-step']['children']
                ['shippingAddress']['children']['customer-email']['children']['imi_friendly_captcha'])) {
                unset($jsLayout['components']['checkout']['children']['steps']['children']['shipping-step']['children']
                    ['shippingAddress']['children']['customer-email']['children']['imi_friendly_captcha']);
            }

            if (isset($jsLayout['components']['checkout']['children']['authentication']['children']['imi_friendly_captcha'])) {
                unset($jsLayout['components']['checkout']['children']['authentication']['children']['imi_friendly_captcha']);
            }
        }

        return $jsLayout;
    }
}
