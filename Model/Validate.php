<?php
/**
 *  Copyright © iMi digital GmbH, based on work by MageSpecialist
 *  See LICENSE for license details.
 */

declare(strict_types=1);

namespace IMI\FriendlyCaptcha\Model;

use IMI\FriendlyCaptcha\Api\ValidateInterface;
use Magento\Framework\HTTP\Client\Curl;
use Magento\Framework\HTTP\Client\CurlFactory;
use Magento\Framework\Serialize\Serializer\Json;
use Psr\Log\LoggerInterface;

class Validate implements ValidateInterface
{
    const PARAMETER_SOLUTION = 'solution';

    const PARAMETER_SECRET = 'secret';

    const PARAMETER_SITEKEY = 'sitekey';

    /**
     * @var LoggerInterface
     */
    private $logger;

    /**
     * @var Config
     */
    private $config;

    /**
     * @var CurlFactory
     */
    private $curlFactory;

    /**
     * @var Json
     */
    private $serializer;

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
        CurlFactory $curlFactory,
        Json $serializer
    ) {
        $this->logger = $logger;
        $this->config = $config;
        $this->curlFactory = $curlFactory;
        $this->serializer = $serializer;
    }

    /**
     * Return true if friendlyCaptcha validation has passed
     *
     * @param string $friendlyCaptchaSolution
     *
     * @return bool
     */
    public function validate(string $friendlyCaptchaSolution): bool
    {
        $parameters = [
            self::PARAMETER_SOLUTION => $friendlyCaptchaSolution,
            self::PARAMETER_SECRET => $this->config->getApikey(),
            self::PARAMETER_SITEKEY => $this->config->getSitekey(),
        ];
        $curl = $this->curlFactory->create();

        try {
            $curl->post($this->getSiteVerifyUrl(), $parameters);
            $response = $this->serializer->unserialize($curl->getBody());

            if ($this->shouldUseResponse($curl, $response)) {
                return $response['success'];
            }
            
            $this->logger->error('Error validating captcha solution.', ['response' => var_export($response, true)]);
        } catch (\Exception $e) {
            $this->logger->critical($e->getMessage(), ['exception' => $e]);
        }

        return false;
    }

    private function getSiteVerifyUrl(): string
    {
        return $this->config->getVerifyEndpoint();
    }

    private function shouldUseResponse(Curl $curl, $response): bool
    {
        $isResponseOk = $curl->getStatus() === 200;
        $isSolutionMissingOrBadRequest = $curl->getStatus() === 400
            && isset($response['success'], $response['errors'])
            && array_intersect($response['errors'], ['solution_missing', 'bad_request']);

        return $isResponseOk || $isSolutionMissingOrBadRequest;
    }
}
