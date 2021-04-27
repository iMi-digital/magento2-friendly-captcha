<?php
/**
 *  Copyright © iMi digital GmbH, based on work by MageSpecialist
 *  See LICENSE for license details.
 */

namespace IMI\FriendlyCaptcha\Plugin\Block\Account;

use Magento\Customer\Block\Account\AuthenticationPopup;
use IMI\FriendlyCaptcha\Model\Config;
use IMI\FriendlyCaptcha\Model\LayoutSettings;
use Magento\Framework\Serialize\Serializer\Json;

class AuthenticationPopupPlugin
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
     * @var Json
     */
    private $serializer;

    /**
     * @param LayoutSettings $layoutSettings
     * @param Config|null $config
     * @param Json $serializer
     */
    public function __construct(
        LayoutSettings $layoutSettings,
        Config $config,
        Json $serializer
    ) {
        $this->layoutSettings = $layoutSettings;
        $this->config = $config;
        $this->serializer = $serializer;
    }

    /**
     * @param AuthenticationPopup $subject
     * @param string $result
     *
     * @return string
     *
     * @SuppressWarnings(PHPMD.UnusedFormalParameter)
     */
    public function afterGetJsLayout(AuthenticationPopup $subject, $result)
    {
        $layout = $this->serializer->unserialize($result);

        if ($this->config->isEnabledFrontend()) {
            $layout['components']['authenticationPopup']['children']['imi_friendly_captcha']['settings']
                = $this->layoutSettings->getCaptchaSettings();
        }

        if (isset($layout['components']['authenticationPopup']['children']['imi_friendly_captcha'])
            && !$this->config->isEnabledFrontend()
        ) {
            unset($layout['components']['authenticationPopup']['children']['imi_friendly_captcha']);
        }

        return $this->serializer->serialize($layout);
    }
}
