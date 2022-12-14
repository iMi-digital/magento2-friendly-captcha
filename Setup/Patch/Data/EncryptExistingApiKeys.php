<?php

declare(strict_types=1);

namespace IMI\FriendlyCaptcha\Setup\Patch\Data;

use IMI\FriendlyCaptcha\Model\Config;
use Magento\Config\Model\ResourceModel\Config\Data\CollectionFactory as ConfigCollectionFactory;
use Magento\Framework\App\Config\Storage\WriterInterface;
use Magento\Framework\App\Config\Value as ConfigValue;
use Magento\Framework\Encryption\EncryptorInterface;
use Magento\Framework\Setup\Patch\DataPatchInterface;

class EncryptExistingApiKeys implements DataPatchInterface
{
    /**
     * @var EncryptorInterface
     */
    private $encryptor;

    /**
     * @var ConfigCollectionFactory
     */
    private $collectionFactory;

    /**
     * @var WriterInterface
     */
    private $writer;

    public function __construct(
        EncryptorInterface $encryptor,
        ConfigCollectionFactory $collectionFactory,
        WriterInterface $writer
    ) {
        $this->encryptor         = $encryptor;
        $this->collectionFactory = $collectionFactory;
        $this->writer            = $writer;
    }

    public static function getDependencies(): array
    {
        return [];
    }

    public function getAliases(): array
    {
        return [];
    }

    public function apply(): self
    {
        $configValues = $this->collectionFactory->create()
            ->addFieldToFilter('path', Config::CONFIG_PATH_APIEKEY);
        /** @var ConfigValue $configValue */
        foreach ($configValues as $configValue) {
            $this->writer->save(
                $configValue->getPath(),
                $this->encryptor->encrypt($configValue->getValue()),
                $configValue->getScope(),
                $configValue->getScopeId()
            );
        }

        return $this;
    }
}
