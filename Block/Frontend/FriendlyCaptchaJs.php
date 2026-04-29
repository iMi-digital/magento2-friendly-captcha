<?php
/**
 *  Copyright © iMi digital GmbH, based on work by MageSpecialist
 *  See LICENSE for license details.
 */

declare(strict_types=1);

namespace IMI\FriendlyCaptcha\Block\Frontend;

use IMI\FriendlyCaptcha\Model\Config;
use Magento\Framework\App\ObjectManager;
use Magento\Framework\View\Element\Template;

class FriendlyCaptchaJs extends Template
{
    private const TEMPLATE_V1 = 'IMI_FriendlyCaptcha::imi_friendly_captcha_js_v1.phtml';
    private const TEMPLATE_V2 = 'IMI_FriendlyCaptcha::imi_friendly_captcha_js_v2.phtml';

    /**
     * @var Config
     */
    private $config;

    /**
     * @param Template\Context $context
     * @param array $data
     * @param Config|null $config
     */
    public function __construct(
        Template\Context $context,
        array $data = [],
        ?Config $config = null
    ) {
        parent::__construct($context, $data);
        $this->config = $config ?: ObjectManager::getInstance()->get(Config::class);

        if (!$this->getTemplate()) {
            $this->setTemplate($this->config->isV2Api() ? self::TEMPLATE_V2 : self::TEMPLATE_V1);
        }
    }
}
