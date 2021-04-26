<?php

namespace IMI\FriendlyCaptcha\Plugin;

use \Magento\Framework\View\Asset\Minification;

/**
 * Class ExcludeFromMinification
 * @package IMI\FriendlyCaptcha\Plugin
 * @todo remove?
 */
class ExcludeFromMinification
{
    /**
     * @param Minification $subject
     * @param callable $proceed
     * @param $contentType
     *
     * @return array
     *
     * @SuppressWarnings(PHPMD.UnusedFormalParameter)
     */
    public function aroundGetExcludes(Minification $subject, callable $proceed, $contentType)
    {
        $result = $proceed($contentType);
        if ($contentType !== 'js') {
            return $result;
        }
        $result[] = 'https://www.google.com/recaptcha/api.js';

        return $result;
    }
}
