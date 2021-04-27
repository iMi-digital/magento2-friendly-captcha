<?php
/**
 *  Copyright © iMi digital GmbH, based on work by MageSpecialist
 *  See LICENSE for license details.
 */

namespace IMI\FriendlyCaptcha\Model\Provider\Failure;

use Magento\Framework\App\ActionFlag;
use Magento\Framework\App\ResponseInterface;
use Magento\Framework\App\Action\Action;
use Magento\Framework\Json\EncoderInterface;
use IMI\FriendlyCaptcha\Model\Config;
use IMI\FriendlyCaptcha\Model\Provider\FailureProviderInterface;

class AjaxResponseFailure implements FailureProviderInterface
{
    /**
     * @var ActionFlag
     */
    private $actionFlag;

    /**
     * @var EncoderInterface
     */
    private $encoder;

    /**
     * @var Config
     */
    private $config;

    /**
     * AjaxResponseFailure constructor.
     * @param ActionFlag $actionFlag
     * @param EncoderInterface $encoder
     * @param Config $config
     */
    public function __construct(
        ActionFlag $actionFlag,
        EncoderInterface $encoder,
        Config $config
    ) {
        $this->actionFlag = $actionFlag;
        $this->encoder = $encoder;
        $this->config = $config;
    }

    /**
     * Handle friendlyCaptcha failure
     * @param ResponseInterface $response
     * @return void
     */
    public function execute(ResponseInterface $response = null)
    {
        $this->actionFlag->set('', Action::FLAG_NO_DISPATCH, true);

        $jsonPayload = $this->encoder->encode([
            'errors' => true,
            'message' => $this->config->getErrorDescription(),
        ]);
        $response->representJson($jsonPayload);
    }
}
