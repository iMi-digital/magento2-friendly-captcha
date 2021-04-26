<?php

namespace IMI\FriendlyCaptcha\Model\Provider\Response;

use Magento\Framework\App\RequestInterface;
use IMI\FriendlyCaptcha\Api\ValidateInterface;
use IMI\FriendlyCaptcha\Model\Provider\ResponseProviderInterface;

class DefaultResponseProvider implements ResponseProviderInterface
{
    /**
     * @var RequestInterface
     */
    private $request;

    /**
     * DefaultResponseProvider constructor.
     *
     * @param RequestInterface $request
     */
    public function __construct(RequestInterface $request)
    {
        $this->request = $request;
    }

    /**
     * Handle friendlyCaptcha failure
     *
     * @return string
     *
     * @SuppressWarnings(PHPMD.UnusedFormalParameter)
     */
    public function execute()
    {
        return $this->request->getParam(ValidateInterface::PARAM_RECAPTCHA_RESPONSE);
    }
}
