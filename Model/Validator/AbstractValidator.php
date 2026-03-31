<?php

namespace IMI\FriendlyCaptcha\Model\Validator;

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
     * @var Config
     */
    protected $config;

    /**
     * @var CurlFactory
     */
    protected $curlFactory;

    /**
     * @var Json
     */
    protected $serializer;

    /**
     * @param Config $config
     * @param CurlFactory $curlFactory
     * @param Json $serializer
     */
    public function __construct(
        Config $config,
        CurlFactory $curlFactory,
        Json $serializer,
    ) {
        $this->config = $config;
        $this->curlFactory = $curlFactory;
        $this->serializer = $serializer;
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
        $success = $response['success'] ?? false;

        return $curl->getStatus() === 200 && $success === true;
    }
}