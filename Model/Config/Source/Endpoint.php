<?php

namespace IMI\FriendlyCaptcha\Model\Config\Source;

use Magento\Framework\Data\OptionSourceInterface;
use Magento\Framework\Phrase;

class Endpoint implements OptionSourceInterface
{
    public const DEFAULT = 0;

    public const EU = 1;

    public const CUSTOM = 2;
    public const V2_DEFAULT = 3;
    public const V2_EU = 4;

    /**
     * @return array<array{value: int, label: Phrase}>
     */
    public function toOptionArray()
    {
        return [
            [
                'value' => '_none',
                'label' => __('V1'),
                'optgroup' => [
                    ['value' => self::DEFAULT, 'label' => __('Default')],
                    ['value' => self::EU, 'label' => __('EU Endpoint')]
                ],
            ],
            [
                'value' => '_none',
                'label' => __('V2'),
                'optgroup' => [
                    ['value' => self::DEFAULT, 'label' => __('Default')],
                    ['value' => self::EU, 'label' => __('EU Endpoint')]
                ],
            ],
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
            self::V2_DEFAULT => __('V2 Default'),
            ['value' => self::V2_EU, 'label' => __('V2 EU Endpoint')],
            self::CUSTOM => __('Custom Endpoint'),
        ];
    }
}
