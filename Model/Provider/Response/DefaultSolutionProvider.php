<?php
/**
 *  Copyright © iMi digital GmbH, based on work by MageSpecialist
 *  See LICENSE for license details.
 */

namespace IMI\FriendlyCaptcha\Model\Provider\Response;

use Magento\Framework\App\RequestInterface;
use IMI\FriendlyCaptcha\Api\ValidateInterface;
use IMI\FriendlyCaptcha\Model\Provider\SolutionProviderInterface;

class DefaultSolutionProvider implements SolutionProviderInterface
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
     * Get Friendly Captcha solution from request
     *
     * @return string
     */
    public function execute(): string
    {
        return $this->request->getParam(ValidateInterface::PARAM_FRIENDLY_CAPTCHA_SOLUTION);
    }
}
