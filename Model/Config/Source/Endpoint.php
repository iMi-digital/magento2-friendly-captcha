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
            ['value' => self::DEFAULT, 'label' => __('V1 - Default endpoint')],
            ['value' => self::EU, 'label' => __('V1 - EU endpoint')],
            ['value' => self::V2_DEFAULT, 'label' => __('V2 - Default endpoint')],
            ['value' => self::V2_EU, 'label' => __('V2 - EU endpoint')],
            ['value' => self::CUSTOM, 'label' => __('Custom Endpoint')]
        ];
    }

    /**
     * @return array<int, Phrase>
     */
    public function toArray()
    {
        return [
            self::DEFAULT => __('V1 - Default endpoint'),
            self::EU => __('V1 - EU endpoint'),
            self::V2_DEFAULT => __('V2 - Default endpoint'),
            self::V2_EU => __('V2 - EU endpoint'),
            self::CUSTOM => __('Custom Endpoint'),
        ];
    }
}
