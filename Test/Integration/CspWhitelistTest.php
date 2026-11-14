<?php

/**
 *  Copyright © iMi digital GmbH, based on work by MageSpecialist
 *  See LICENSE for license details.
 */

declare(strict_types=1);

namespace IMI\FriendlyCaptcha\Test\Integration;

use LogicException;
use Magento\Csp\Model\Collector\CspWhitelistXmlCollector;
use Magento\Csp\Model\Policy\FetchPolicy;
use Magento\Framework\App\ObjectManager;
use PHPUnit\Framework\TestCase;

/**
 * @magentoAppArea frontend
 */
class CspWhitelistTest extends TestCase
{
    public function testWorkerSrcAllowsBlobForV1WidgetWorker(): void
    {
        $workerSrc = $this->getPolicy('worker-src');

        self::assertContains('blob:', $workerSrc->getHostSources());
        self::assertStringContainsString('blob:', $workerSrc->getValue());
    }

    public function testWorkerSrcKeepsSelfSoOtherWorkersAreNotBlocked(): void
    {
        self::assertContains("'self'", $this->getPolicy('worker-src')->getHostSources());
    }

    private function getPolicy(string $id): FetchPolicy
    {
        $collector = ObjectManager::getInstance()->get(CspWhitelistXmlCollector::class);

        foreach ($collector->collect() as $policy) {
            if ($policy->getId() === $id) {
                return $policy;
            }
        }

        throw new LogicException(sprintf('Policy "%s" not found in the merged CSP whitelist', $id));
    }
}
