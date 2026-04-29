<?php
/**
 *  Copyright © iMi digital GmbH, based on work by MageSpecialist
 *  See LICENSE for license details.
 */

declare(strict_types=1);

namespace IMI\FriendlyCaptcha\Test\Integration;

use IMI\FriendlyCaptcha\Api\ValidateInterface;
use IMI\FriendlyCaptcha\Model\Validate;
use Magento\Framework\App\ObjectManager;
use Magento\Framework\Module\Manager as ModuleManager;
use PHPUnit\Framework\TestCase;

class ModuleTest extends TestCase
{
    public function testModuleIsEnabled(): void
    {
        $moduleManager = ObjectManager::getInstance()->get(ModuleManager::class);

        self::assertTrue($moduleManager->isEnabled('IMI_FriendlyCaptcha'));
    }

    public function testValidateInterfacePreferenceIsConfigured(): void
    {
        $validate = ObjectManager::getInstance()->get(ValidateInterface::class);

        self::assertInstanceOf(Validate::class, $validate);
    }
}
