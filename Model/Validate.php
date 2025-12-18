<?php
/**
 *  Copyright © iMi digital GmbH, based on work by MageSpecialist
 *  See LICENSE for license details.
 */

declare(strict_types=1);

namespace IMI\FriendlyCaptcha\Model;

use IMI\FriendlyCaptcha\Api\ValidateInterface;
use IMI\FriendlyCaptcha\Model\Exception\InvalidSolutionException;
use Psr\Log\LoggerInterface;
use Magento\Framework\HTTP\PhpEnvironment\RemoteAddress;

/**
 * Friendly Captcha validation service
 *
 * This class serves as the main entry point for validating Friendly Captcha solutions.
 * It acts as a router/facade that delegates validation to the appropriate endpoint-specific
 * validator based on the configured verification endpoint (V1 or V2).
 *
 * @see ValidateInterface
 * @see Config::getVerifyEndpoint()
 */
class Validate implements ValidateInterface
{
    /**
     * @var LoggerInterface
     */
    private $logger;

    /**
     * @var Config
     */
    private $config;

    /**
     * Map of endpoint identifiers to validator implementations.
     * Key is the endpoint constant, value is the validator instance.
     * @var array<int, ValidateInterface>
     */
    private $validatorByEndpoint;

    /**
     * @var Json
     */
    private $serializer;

    private $remoteAddress;

    /**
     * Validate constructor.
     *
     * @param LoggerInterface $logger
     * @param Config $config
     * @param CurlFactory $curlFactory
     * @param Json $serializer
     */
    public function __construct(
        LoggerInterface $logger,
        Config $config,
        RemoteAddress $remoteAddress,
        array $validatorByEndpoint
    ) {
        $this->remoteAddress = $remoteAddress;
        $this->validatorByEndpoint = $validatorByEndpoint;
        $this->logger = $logger;
        $this->config = $config;
    }

    /**
     * @inheritDoc
     */
    public function validate(string $friendlyCaptchaSolution): bool
    {
        $ips = $this->config->getTrustedIps();
        $clientIp = $this->remoteAddress->getRemoteAddress();
        if ($ips !== [] && in_array((string)$clientIp, $ips, true)) {
            return true;
        }

        $endpoint = $this->config->getVerifyEndpoint();
        $validator = $this->validatorByEndpoint[$endpoint] ?? null;
        if ($validator === null) {
            return false;
        }

        if (!$validator instanceof ValidateInterface) {
            throw new \RuntimeException(sprintf(
                'Validator for endpoint %s is not an instance of %s',
                $endpoint,
                ValidateInterface::class
            ));
        }

        try {
            $result = $validator->validate($friendlyCaptchaSolution);
            if ($result === true) {
                return true;
            }

        } catch (InvalidSolutionException $e) {
            $this->logger->error($e->getMessage(), ['response' => var_export($e->getResponse(), true)]);
        } catch (\Exception $e) {
            $this->logger->critical($e->getMessage(), ['exception' => $e]);
        }

        return false;
    }
}
