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
     * @return int
     */
    public function getEndpoint(): int
    {
        return (int)$this->scopeConfig->getValue(static::CONFIG_PATH_ENDPOINT, ScopeInterface::SCOPE_WEBSITE);
    }

    /**
     * Get Friendly Captcha puzzle endpoint URL based on the configured endpoint.
     * Returns the appropriate puzzle API endpoint URL depending on the endpoint configuration.
     *
     * @return string The Friendly Captcha puzzle API endpoint URL, or empty string if not configured
     */
    public function getPuzzleEndpoint(): string
    {
        $endpoint = $this->getEndpoint();
        if ($endpoint === Endpoint::CUSTOM) {
            return (string)$this->scopeConfig->getValue(
                static::CONFIG_PATH_CUSTOM_PUZZLE,
                ScopeInterface::SCOPE_WEBSITE
            );
        }

        $mapping = [
            Endpoint::EU => 'https://eu-api.friendlycaptcha.eu/api/v1/puzzle',
            Endpoint::DEFAULT => 'https://api.friendlycaptcha.com/api/v1/puzzlee',
        ];

        return $mapping[$endpoint] ?? '';
    }

    /**
     * Get Friendly Captcha verify endpoint URL based on the configured endpoint. Returns the appropriate siteverify
     * API endpoint URL depending on the endpoint configuration.
     *
     * Falls back to the default global v1 endpoint if the configured endpoint is not recognized.
     * @see https://developer.friendlycaptcha.com/docs/v2/getting-started/verify
     *
     * @return string
     */
    public function getVerifyEndpoint(): string
    {
        $endpoint = $this->getEndpoint();
        if ($endpoint === Endpoint::CUSTOM) {
            return (string)$this->scopeConfig->getValue(
                static::CONFIG_PATH_CUSTOM_VERIFY,
                ScopeInterface::SCOPE_WEBSITE
            );
        }

        $mapping = [
            Endpoint::EU => 'https://eu-api.friendlycaptcha.eu/api/v1/siteverify',
            Endpoint::DEFAULT => 'https://api.friendlycaptcha.com/api/v1/siteverify',
            Endpoint::V2_DEFAULT => 'https://global.frcapi.com/api/v2/captcha/siteverify',
            Endpoint::V2_EU => 'https://eu.frcapi.com/api/v2/captcha/siteverify',
        ];

        return $mapping[$endpoint] ?? $mapping[Endpoint::DEFAULT];
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
