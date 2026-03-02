<?php

namespace IMI\FriendlyCaptcha\Model\Config\Source;

use IMI\FriendlyCaptcha\Enum\EndpointEnum;
use Magento\Framework\Data\OptionSourceInterface;
use Magento\Framework\Phrase;

class Endpoint implements OptionSourceInterface
{
    /**
     * @return array
     */
    public function toOptionArray()
    {
        $options = [];
        foreach (EndpointEnum::cases() as $key => $value) {
            $options[] = [
                'value' => $key,
                'label' => $value->getLabel()
            ];
        }

        return $options;
    }
}
