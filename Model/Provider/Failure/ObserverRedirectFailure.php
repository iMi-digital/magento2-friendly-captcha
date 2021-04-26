<?php

namespace IMI\FriendlyCaptcha\Model\Provider\Failure;

use Magento\Framework\App\ActionFlag;
use Magento\Framework\App\ResponseInterface;
use Magento\Framework\Message\ManagerInterface as MessageManagerInterface;
use Magento\Framework\App\Action\Action;
use Magento\Framework\UrlInterface;
use IMI\FriendlyCaptcha\Model\Config;
use IMI\FriendlyCaptcha\Model\Provider\FailureProviderInterface;

class ObserverRedirectFailure implements FailureProviderInterface
{
    /**
     * @var MessageManagerInterface
     */
    private $messageManager;

    /**
     * @var ActionFlag
     */
    private $actionFlag;

    /**
     * @var Config
     */
    private $config;

    /**
     * @var RedirectUrlProviderInterface
     */
    private $redirectUrlProvider;

    /**
     * @var UrlInterface
     */
    private $url;

    /**
     * RedirectFailure constructor.
     * @param MessageManagerInterface $messageManager
     * @param ActionFlag $actionFlag
     * @param Config $config
     * @param UrlInterface $url
     * @param RedirectUrlProviderInterface|null $redirectUrlProvider
     */
    public function __construct(
        MessageManagerInterface $messageManager,
        ActionFlag $actionFlag,
        Config $config,
        UrlInterface $url,
        RedirectUrlProviderInterface $redirectUrlProvider = null
    ) {
        $this->messageManager = $messageManager;
        $this->actionFlag = $actionFlag;
        $this->config = $config;
        $this->redirectUrlProvider = $redirectUrlProvider;
        $this->url = $url;
    }

    /**
     * Get redirect URL
     * @return string
     */
    private function getUrl()
    {
        return $this->redirectUrlProvider->execute();
    }

    /**
     * Handle friendlyCaptcha failure
     * @param ResponseInterface $response
     * @return void
     */
    public function execute(ResponseInterface $response = null)
    {
        $this->messageManager->addErrorMessage($this->config->getErrorDescription());
        $this->actionFlag->set('', Action::FLAG_NO_DISPATCH, true);

        $response->setRedirect($this->getUrl());
    }
}
