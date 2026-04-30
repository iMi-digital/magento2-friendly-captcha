<?php

/**
 *  Copyright © iMi digital GmbH, based on work by MageSpecialist
 *  See LICENSE for license details.
 */

namespace IMI\FriendlyCaptcha\Enum;

use Magento\Framework\Phrase;

/**
 * Friendly Captcha API endpoint configuration options
 *
 * Defines the available Friendly Captcha API endpoints that can be configured.
 * Supports both v1 and v2 API versions across different regions.
 *
 * Fallback is V1 - Default.
 */
enum EndpointEnum: int
{
    case DEFAULT = 0;
    case EU = 1;
    case CUSTOM = 2;
    case V2_DEFAULT = 3;
    case V2_EU = 4;

    /**
     * Get the human-readable label for this endpoint
     *
     * @return Phrase
     */
    public function getLabel(): Phrase
    {
        return match($this) {
            self::DEFAULT => __('V1 - Default endpoint'),
            self::EU => __('V1 - EU endpoint'),
            self::V2_DEFAULT => __('V2 - Default endpoint'),
            self::V2_EU => __('V2 - EU endpoint'),
            self::CUSTOM => __('Custom Endpoint'),
        };
    }

    /**
     * Get the verify endpoint URL for this endpoint type
     *
     * @return string|null Returns null for CUSTOM endpoint (requires user configuration)
     */
    public function getVerifyUrl(): ?string
    {
        return match($this) {
            self::DEFAULT => 'https://api.friendlycaptcha.com/api/v1/siteverify',
            self::EU => 'https://eu-api.friendlycaptcha.eu/api/v1/siteverify',
            self::V2_DEFAULT => 'https://global.frcapi.com/api/v2/captcha/siteverify',
            self::V2_EU => 'https://eu.frcapi.com/api/v2/captcha/siteverify',
            self::CUSTOM => null,
        };
    }

    /**
     * Get the puzzle endpoint URL for this endpoint type
     *
     * @return string|null Returns null for CUSTOM endpoint (requires user configuration)
     */
    public function getPuzzleUrl(): ?string
    {
        return match($this) {
            self::DEFAULT => 'https://api.friendlycaptcha.com/api/v1/puzzle',
            self::EU => 'https://eu-api.friendlycaptcha.eu/api/v1/puzzle',
            self::V2_DEFAULT => 'https://global.frcapi.com/api/v2/puzzle',
            self::V2_EU => 'https://eu.frcapi.com/api/v2/puzzle',
            self::CUSTOM => null,
        };
    }
}
