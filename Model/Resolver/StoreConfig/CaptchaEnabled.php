<?php
/**
 *  Copyright © iMi digital GmbH, based on work by MageSpecialist
 *  See LICENSE for license details.
 */

namespace IMI\FriendlyCaptcha\Model\Resolver\StoreConfig;

use IMI\FriendlyCaptcha\Model\Config;

class CaptchaEnabled implements ResolverInterface
{
    /**
     * @var Config
     */
    private $config;

    /**
     * CaptchaEnabled Constructor
     *
     * @param Config $config
     */
    public function __construct(
        Config $config
    ) {
        $this->config = $config;
    }

    /**
     * @inheritDoc
     */
    public function resolve(
        Field $field,
        $context,
        ResolveInfo $info,
        array $value = null,
        array $args = null
    ) {
        return $this->config->isEnabledFrontend();
    }
}