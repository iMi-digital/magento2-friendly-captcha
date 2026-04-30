<?php
/**
 *  Copyright © iMi digital GmbH, based on work by MageSpecialist
 *  See LICENSE for license details.
 */

namespace IMI\FriendlyCaptcha\Model\Validator;

use IMI\FriendlyCaptcha\Api\ValidateInterface;
use IMI\FriendlyCaptcha\Model\Exception\InvalidSolutionException;
use Magento\Framework\HTTP\Client\Curl;
use Magento\Framework\HTTP\Client\CurlFactory;
use Magento\Framework\Serialize\Serializer\Json;
use Magento\Framework\Webapi\Response;

/**
 * Validator implementation for Friendly Captcha v2 API.
 * This validator handles verification of Friendly Captcha solutions using the v2 API protocol.
 *
 * @see https://developer.friendlycaptcha.com/docs/v2/getting-started/verify
 */
class ValidatorV2 extends AbstractValidator implements ValidateInterface
{
    /**
     * @inheritDoc
     */
    public function validate(string $friendlyCaptchaSolution): bool
    {
        /** @var Curl $curl */
        $curl = $this->curlFactory->create();
        $curl->setHeaders([
            'User-Agent' => $this->getUserAgent(),
            'X-API-Key' => $this->config->getApikey(),
        ]);

        $curl->post($this->config->getVerifyEndpoint(), [
            'response' => $friendlyCaptchaSolution,
            'sitekey' => $this->config->getSitekey(),
        ]);

        $response = $this->serializer->unserialize($curl->getBody());
        if ($this->isSuccessResponse($curl, $response)) {
           return true;
        }

        throw new InvalidSolutionException($response);
    }

    protected function shouldUseResponse($status, $response): bool
    {
        $isResponseOk = $status === 200;
        $isSolutionMissingOrBadRequest = $status === 400
            && isset($response['success'], $response['error'])
            && in_array($response['error']['error_code'], ['response_missing', 'bad_request']);

        return $isResponseOk || $isSolutionMissingOrBadRequest;
    }    
}