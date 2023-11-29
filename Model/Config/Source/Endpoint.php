<?php

namespace IMI\FriendlyCaptcha\Model\Config\Source;

use Magento\Framework\Option\ArrayInterface;
use Magento\Framework\Phrase;

class Endpoint implements ArrayInterface
{
    public const DEFAULT = 0;

    public const EU = 1;

    public const CUSTOM = 2;

    /**
     * @return array<array{value: int, label: Phrase}>
     */
    public function toOptionArray()
    {
        return [
            ['value' => self::DEFAULT, 'label' => __('Default')],
            ['value' => self::EU, 'label' => __('EU Endpoint')],
            ['value' => self::CUSTOM, 'label' => __('Custom Endpoint')],
        ];
    }

    /**
     * @return array<int, Phrase>
     */
    public function toArray()
    {
        return [
            self::DEFAULT => __('Default'),
            self::EU => __('EU Endpoint'),
            self::CUSTOM => __('Custom Endpoint'),
        ];
    }
}
