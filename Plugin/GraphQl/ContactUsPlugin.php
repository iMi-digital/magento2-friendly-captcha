<?php
/**
 *  Copyright © iMi digital GmbH, based on work by MageSpecialist
 *  See LICENSE for license details.
 */

declare(strict_types=1);

namespace IMI\FriendlyCaptcha\Plugin\GraphQl;

use IMI\FriendlyCaptcha\Model\Config;
use Magento\ContactGraphQl\Model\Resolver\ContactUs;
use Magento\Framework\GraphQl\Config\Element\Field;
use Magento\Framework\GraphQl\Exception\GraphQlInputException;
use Magento\Framework\GraphQl\Schema\Type\ResolveInfo;

class ContactUsPlugin
{
    public function __construct(private readonly Config $config)
    {
    }

    /**
     * Disable the mutation entirely when explicitly configured to avoid uncaptcha'd contact submissions.
     *
     * @param callable(): array<string, bool> $proceed
     * @param mixed $context
     * @param array<mixed>|null $value
     * @param array<mixed>|null $args
     * @return array<string, bool>
     * @throws GraphQlInputException
     */
    public function aroundResolve(
        ContactUs $subject,
        callable $proceed,
        Field $field,
        $context,
        ResolveInfo $info,
        array $value = null,
        array $args = null
    ): array {
        if ($this->config->isGraphQlContactUsMutationDisabled()) {
            throw new GraphQlInputException(__('The contactUs GraphQL mutation is disabled.'));
        }

        return $proceed($field, $context, $info, $value, $args);
    }
}
