<?php
/**
 *  Copyright © iMi digital GmbH, based on work by MageSpecialist
 *  See LICENSE for license details.
 */

namespace IMI\FriendlyCaptcha\Model\Validator;

use IMI\FriendlyCaptcha\Api\ValidateInterface;
use IMI\FriendlyCaptcha\Model\Exception\InvalidSolutionException;
use Magento\Framework\HTTP\Client\Curl;

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
}
