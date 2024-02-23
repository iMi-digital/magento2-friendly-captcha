<?php
/**
 *  Copyright © iMi digital GmbH, based on work by MageSpecialist
 *  See LICENSE for license details.
 */

declare(strict_types=1);

namespace IMI\FriendlyCaptcha\Model;

use IMI\FriendlyCaptcha\Model\Config\Source\Endpoint;
use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\Phrase;
use Magento\Store\Model\ScopeInterface;

class Config
{
    public const CONFIG_PATH_SITEKEY = 'imi_friendly_captcha/general/sitekey';

    public const CONFIG_PATH_APIEKEY = 'imi_friendly_captcha/general/apikey';

    public const CONFIG_PATH_ENDPOINT = 'imi_friendly_captcha/general/endpoint';

    public const CONFIG_PATH_ENABLED_FRONTEND = 'imi_friendly_captcha/frontend/enabled';

    public const CONFIG_PATH_ENABLED_FRONTEND_LOGIN = 'imi_friendly_captcha/frontend/enabled_login';

    public const CONFIG_PATH_ENABLED_FRONTEND_FORGOT = 'imi_friendly_captcha/frontend/enabled_forgot';

    public const CONFIG_PATH_ENABLED_FRONTEND_CONTACT = 'imi_friendly_captcha/frontend/enabled_contact';

    public const CONFIG_PATH_ENABLED_FRONTEND_CREATE = 'imi_friendly_captcha/frontend/enabled_create';

    public const CONFIG_PATH_ENABLED_FRONTEND_REVIEW = 'imi_friendly_captcha/frontend/enabled_review';

    public const CONFIG_PATH_ENABLED_FRONTEND_NEWSLETTER = 'imi_friendly_captcha/frontend/enabled_newsletter';

    public const CONFIG_PATH_ENABLED_FRONTEND_SENDFRIEND = 'imi_friendly_captcha/frontend/enabled_sendfriend';

    protected const CONFIG_PATH_CUSTOM_PUZZLE = 'imi_friendly_captcha/general/custom_puzzle';

    protected const CONFIG_PATH_CUSTOM_VERIFY = 'imi_friendly_captcha/general/custom_verify';

    /**
     * @var ScopeConfigInterface
     */
    private $scopeConfig;

    /**
     * @param ScopeConfigInterface $scopeConfig
     */
    public function __construct(ScopeConfigInterface $scopeConfig)
    {
        $this->scopeConfig = $scopeConfig;
    }

    /**
     * Get error description
     *
     * @return Phrase
     */
    public function getErrorDescription(): Phrase
    {
        return __('Incorrect Friendly Captcha validation');
    }

    /**
     * Return true if enabled on frontend login
     *
     * @return bool
     */
    public function isEnabledFrontendLogin(): bool
    {
        if (!$this->isEnabledFrontend()) {
            return false;
        }

        return (bool)$this->scopeConfig->getValue(
            static::CONFIG_PATH_ENABLED_FRONTEND_LOGIN,
            ScopeInterface::SCOPE_WEBSITE
        );
    }

    /**
     * Return true if enabled on frontend
     *
     * @return bool
     */
    public function isEnabledFrontend(): bool
    {
        if (!$this->getSitekey() || !$this->getApikey()) {
            return false;
        }

        return (bool)$this->scopeConfig->getValue(
            static::CONFIG_PATH_ENABLED_FRONTEND,
            ScopeInterface::SCOPE_WEBSITE
        );
    }

    /**
     * Get Friendly Captcha sitekey
     *
     * @return string
     */
    public function getSitekey(): string
    {
        return trim((string)$this->scopeConfig->getValue(static::CONFIG_PATH_SITEKEY,
            ScopeInterface::SCOPE_WEBSITE));
    }

    /**
     * Get Friendly Captcha sitekey
     *
     * @return string
     */
    public function getApikey(): string
    {
        return trim((string)$this->scopeConfig->getValue(static::CONFIG_PATH_APIEKEY,
            ScopeInterface::SCOPE_WEBSITE));
    }

    /**
     * Get Friendly Captcha puzzle endpoint
     */
    public function getPuzzleEndpoint(): string
    {
        $endpoint = (int)$this->scopeConfig->getValue(static::CONFIG_PATH_ENDPOINT, ScopeInterface::SCOPE_WEBSITE);

        switch ($endpoint) {
            case Endpoint::EU:
                return 'https://eu-api.friendlycaptcha.eu/api/v1/puzzle';
            case Endpoint::CUSTOM:
                return (string)$this->scopeConfig->getValue(
                    static::CONFIG_PATH_CUSTOM_PUZZLE,
                    ScopeInterface::SCOPE_WEBSITE
                );
            default:
                return '';
        }
    }

    /**
     * Get Friendly Captcha verify endpoint
     */
    public function getVerifyEndpoint(): string
    {
        $endpoint = (int)$this->scopeConfig->getValue(static::CONFIG_PATH_ENDPOINT, ScopeInterface::SCOPE_WEBSITE);

        switch ($endpoint) {
            case Endpoint::EU:
                return 'https://eu-api.friendlycaptcha.eu/api/v1/siteverify';
            case Endpoint::CUSTOM:
                return (string)$this->scopeConfig->getValue(
                    static::CONFIG_PATH_CUSTOM_VERIFY,
                    ScopeInterface::SCOPE_WEBSITE
                );
            default:
                return 'https://api.friendlycaptcha.com/api/v1/siteverify';
        }
    }

    /**
     * Return true if enabled on frontend forgot password
     *
     * @return bool
     */
    public function isEnabledFrontendForgot(): bool
    {
        if (!$this->isEnabledFrontend()) {
            return false;
        }

        return (bool)$this->scopeConfig->getValue(
            static::CONFIG_PATH_ENABLED_FRONTEND_FORGOT,
            ScopeInterface::SCOPE_WEBSITE
        );
    }

    /**
     * Return true if enabled on frontend contact
     *
     * @return bool
     */
    public function isEnabledFrontendContact(): bool
    {
        if (!$this->isEnabledFrontend()) {
            return false;
        }

        return (bool)$this->scopeConfig->getValue(
            static::CONFIG_PATH_ENABLED_FRONTEND_CONTACT,
            ScopeInterface::SCOPE_WEBSITE
        );
    }

    /**
     * Return true if enabled on frontend create user
     *
     * @return bool
     */
    public function isEnabledFrontendCreate(): bool
    {
        if (!$this->isEnabledFrontend()) {
            return false;
        }

        return (bool)$this->scopeConfig->getValue(
            static::CONFIG_PATH_ENABLED_FRONTEND_CREATE,
            ScopeInterface::SCOPE_WEBSITE
        );
    }

    /**
     * Return true if enabled on frontend review
     *
     * @return bool
     */
    public function isEnabledFrontendReview(): bool
    {
        if (!$this->isEnabledFrontend()) {
            return false;
        }

        return (bool)$this->scopeConfig->getValue(
            static::CONFIG_PATH_ENABLED_FRONTEND_REVIEW,
            ScopeInterface::SCOPE_WEBSITE
        );
    }

    /**
     * Return true if enabled on frontend newsletter
     *
     * @return bool
     */
    public function isEnabledFrontendNewsletter(): bool
    {
        if (!$this->isEnabledFrontend()) {
            return false;
        }

        return (bool)$this->scopeConfig->getValue(
            static::CONFIG_PATH_ENABLED_FRONTEND_NEWSLETTER,
            ScopeInterface::SCOPE_WEBSITE
        );
    }

    /**
     * Return true if enabled on frontend send to friend
     *
     * @return bool
     */
    public function isEnabledFrontendSendFriend(): bool
    {
        if (!$this->isEnabledFrontend()) {
            return false;
        }

        return (bool)$this->scopeConfig->getValue(
            static::CONFIG_PATH_ENABLED_FRONTEND_SENDFRIEND,
            ScopeInterface::SCOPE_WEBSITE
        );
    }
}
