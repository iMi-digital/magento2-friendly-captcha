<?php
/**
 *  Copyright © iMi digital GmbH, based on work by MageSpecialist
 *  See LICENSE for license details.
 */

namespace IMI\FriendlyCaptcha\Block\Frontend;

use Magento\Framework\App\ObjectManager;
use Magento\Framework\Locale\ResolverInterface;
use Magento\Framework\View\Element\Template;
use IMI\FriendlyCaptcha\Model\Config;
use IMI\FriendlyCaptcha\Model\LayoutSettings;
use Zend\Json\Json;

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
     * @var ResolverInterface
     */
    private $localeResolver;

    /**
     * @param Template\Context $context
     * @param LayoutSettings $layoutSettings
     * @param ResolverInterface $localeResolver
     * @param array $data
     * @param Config|null $config
     */
    public function __construct(
        Template\Context $context,
        LayoutSettings $layoutSettings,
        ResolverInterface $localeResolver,
        array $data = [],
        Config $config = null
    ) {
        parent::__construct($context, $data);
        $this->layoutSettings = $layoutSettings;
        $this->config = $config ?: ObjectManager::getInstance()->get(Config::class);
        $this->localeResolver = $localeResolver;
    }

    /**
     * Get public friendlyCaptcha key
     *
     * @return string
     */
    public function getSiteKey(): string
    {
        return $this->config->getSiteKey();
    }

    public function getPuzzleEndpoint(): string
    {
        return $this->config->getPuzzleEndpoint();
    }

    /**
     * Get the current language
     *
     * @return string
     */
    public function getLang(): string
    {
        $locale = locale_parse($this->localeResolver->getLocale());

        return $locale['language'];
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
                $layout['components'][$this->getWidgetId()] = $layout['components']['imi-friendly-captcha'];
                unset($layout['components']['imi-friendly-captcha']);
            }

            $recaptchaComponentSettings = [];
            if (isset($layout['components'][$this->getWidgetId()]['settings'])) {
                $recaptchaComponentSettings = $layout['components'][$this->getWidgetId()]['settings'];
            }
            $layout['components'][$this->getWidgetId()]['settings'] = array_replace_recursive(
                $this->layoutSettings->getCaptchaSettings(),
                $recaptchaComponentSettings
            );

            $layout['components'][$this->getWidgetId()]['friendlyCaptchaId'] = $this->getWidgetId();
        }

        return Json::encode($layout);
    }

    /**
     * Get widget ID
     *
     * @return string
     */
    public function getWidgetId(): string
    {
        if (!$this->hasData('widget_id')) {
            $this->setData('widget_id', md5($this->getNameInLayout()));
        }

        return $this->getData('widget_id');
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

    public function isCaptchaEnabled(): bool
    {
        return $this->config->isEnabledFrontend();
    }
}
