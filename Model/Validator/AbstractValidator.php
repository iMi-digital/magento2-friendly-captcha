<?php

namespace IMI\FriendlyCaptcha\Model\Validator;

use RuntimeException;
use IMI\FriendlyCaptcha\Model\Config;
use Magento\Framework\HTTP\Client\Curl;
use Magento\Framework\HTTP\Client\CurlFactory;
use Magento\Framework\Serialize\Serializer\Json;

/**
 * Base class for Friendly Captcha solution validators.
 *
 * Provides shared dependencies and helper methods used by concrete validator
 * implementations (e.g. ValidatorV1, ValidatorV2). Each concrete validator is
 * responsible for building the HTTP request according to its API version and
 * calling {@see isSuccessResponse()} to evaluate the result.
 */
abstract class AbstractValidator
{
    /**
     * @param Config $config
     * @param CurlFactory $curlFactory
     * @param Json $serializer
     */
    public function __construct(
        protected readonly Config $config,
        protected readonly CurlFactory $curlFactory,
        protected readonly Json $serializer,
    ) {
    }

    /**
     * Determine whether the Friendly Captcha verification API returned a successful response.
     *
     * A response is considered successful when the HTTP status code is 200 and
     * the decoded JSON body contains a truthy `success` field.
     *
     * @param Curl $curl
     * @param array $response
     * @return bool True if the captcha solution was accepted, false otherwise
     */
    protected function isSuccessResponse(Curl $curl, array $response): bool
    {
        $status = $curl->getStatus(); 
        if ($status !== 200) {
            throw new RuntimeException('Friendly Captcha API returned non-200 status code: ' . $status);
        }
        
        $success = $response['success'] ?? false;

        return $success === true;
    }

    abstract public function validate(string $friendlyCaptchaSolution): bool;
}