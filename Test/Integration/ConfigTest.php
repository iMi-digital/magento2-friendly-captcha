<?php

/**
 *  Copyright © iMi digital GmbH, based on work by MageSpecialist
 *  See LICENSE for license details.
 */

declare(strict_types=1);

namespace IMI\FriendlyCaptcha\Test\Integration;

use IMI\FriendlyCaptcha\Model\Config;
use Magento\Framework\App\ObjectManager;
use PHPUnit\Framework\TestCase;

class ConfigTest extends TestCase
{
    /**
     * @magentoAppArea frontend
     *
     * @magentoAppIsolation enabled
     *
     * @magentoConfigFixture base_website imi_friendly_captcha/general/sitekey test-site-key
     * @magentoConfigFixture base_website imi_friendly_captcha/general/apikey test-api-key
     */
    public function testGetSitekeyReturnsWebsiteScopeConfigValue(): void
    {
        $config = ObjectManager::getInstance()->get(Config::class);

        self::assertSame('test-site-key', $config->getSitekey());
        self::assertSame('test-api-key', $config->getApikey());
    }
}
