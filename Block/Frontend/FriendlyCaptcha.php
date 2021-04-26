<?php

namespace IMI\FriendlyCaptcha\Block\Frontend;

use Magento\Framework\App\ObjectManager;
use Magento\Framework\View\Element\Template;
use IMI\FriendlyCaptcha\Model\Config;
use IMI\FriendlyCaptcha\Model\LayoutSettings;
use Zend\Json\Json;

/**
 * Class FriendlyCaptcha
 * @package IMI\FriendlyCaptcha\Block\Frontend
 * @todo: use view model instead
 */
class FriendlyCaptcha extends Template
{
    /**
     * @var Config
     */
    private $config;

    /**
     * @var LayoutSettings
     */
    private $layoutSettings;

    /**
     * @param Template\Context $context
     * @param LayoutSettings $layoutSettings
     * @param array $data
     * @param Config|null $config
     */
    public function __construct(
        Template\Context $context,
        LayoutSettings $layoutSettings,
        array $data = [],
        Config $config = null
    ) {
        parent::__construct($context, $data);
        $this->layoutSettings = $layoutSettings;
        $this->config = $config ?: ObjectManager::getInstance()->get(Config::class);
    }

    /**
     * Get public friendlyCaptcha key
     * @return string
     */
    public function getSiteKey()
    {
        return $this->config->getSiteKey();
    }

    /**
     * @return bool
     */
    public function useEuEndpoint(): bool
    {
        return $this->config->useEuEndpoint();
    }

    /**
     * Get current recaptcha ID
     */
    public function getRecaptchaId()
    {
        return (string) $this->getData('recaptcha_id') ?: 'imi-friendly-captcha-' . md5($this->getNameInLayout());
    }

    /**
     * @inheritdoc
     */
    public function getJsLayout()
    {
        $layout = Json::decode(parent::getJsLayout(), Json::TYPE_ARRAY);

        if ($this->config->isEnabledFrontend()) {
            // Backward compatibility with fixed scope name
            if (isset($layout['components']['imi-friendly-captcha'])) {
                $layout['components'][$this->getRecaptchaId()] = $layout['components']['imi-friendly-captcha'];
                unset($layout['components']['imi-friendly-captcha']);
            }

            $recaptchaComponentSettings = [];
            if (isset($layout['components'][$this->getRecaptchaId()]['settings'])) {
                $recaptchaComponentSettings = $layout['components'][$this->getRecaptchaId()]['settings'];
            }
            $layout['components'][$this->getRecaptchaId()]['settings'] = array_replace_recursive(
                $this->layoutSettings->getCaptchaSettings(),
                $recaptchaComponentSettings
            );

            $layout['components'][$this->getRecaptchaId()]['friendlyCaptchaId'] = $this->getRecaptchaId();
        }

        return Json::encode($layout);
    }
    
    /**
     * @return string
     */
    public function toHtml()
    {
        if (!$this->config->isEnabledFrontend()) {
            return '';
        }

        return parent::toHtml();
    }
}
