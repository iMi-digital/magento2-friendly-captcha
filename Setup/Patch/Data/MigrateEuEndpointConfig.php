<?php

/**
 *  Copyright © iMi digital GmbH, based on work by MageSpecialist
 *  See LICENSE for license details.
 */

namespace IMI\FriendlyCaptcha\Setup\Patch\Data;

use Magento\Config\Model\ResourceModel\Config\Data as ConfigResource;
use Magento\Config\Model\ResourceModel\Config\Data\CollectionFactory as ConfigCollectionFactory;
use Magento\Framework\App\Config\Value;
use Magento\Framework\Setup\Patch\DataPatchInterface;

class MigrateEuEndpointConfig implements DataPatchInterface
{
    public function __construct(
        private readonly ConfigResource $configResource,
        private readonly ConfigCollectionFactory $configCollectionFactory
    ) {
    }

    /**
     * @inheritDoc
     */
    public static function getDependencies(): array
    {
        return [];
    }

    /**
     * @inheritDoc
     */
    public function getAliases(): array
    {
        return [];
    }

    /**
     * @inheritDoc
     */
    public function apply(): self
    {
        $collection = $this->configCollectionFactory->create();
        $collection->addFieldToFilter('path', ['eq' => 'imi_friendly_captcha/general/eu_endpoint']);
        $collection->getItems();

        /** @var Value $config */
        foreach ($collection as $config) {
            $config->setPath('imi_friendly_captcha/general/endpoint');
            $this->configResource->save($config);
        }

        return $this;
    }
}
