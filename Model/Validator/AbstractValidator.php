<?php

namespace IMI\FriendlyCaptcha\Model\Validator;

use IMI\FriendlyCaptcha\Model\Config;
use Magento\Framework\HTTP\Client\Curl;

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
     * AbstractValidator constructor.
     *
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
     * @param Curl $curl
     * @param array $response
     * @return bool
     */
    protected function isSuccessResponse(Curl $curl, array $response): bool
    {
        $success = $response['success'] ?? false;
        return $curl->getStatus() === 200 && $success === true;
    }
}