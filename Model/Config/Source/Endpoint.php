<?php
/**
 *  Copyright © iMi digital GmbH, based on work by MageSpecialist
 *  See LICENSE for license details.
 */

namespace IMI\FriendlyCaptcha\Model\Config\Source;

use IMI\FriendlyCaptcha\Enum\EndpointEnum;
use Magento\Framework\Data\OptionSourceInterface;

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
                'label' => $value->getLabel(),
            ];
        }

        return $options;
    }
}
