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
 * Validator implementation for Friendly Captcha v1 API.
 * This validator handles verification of Friendly Captcha solutions using the v1 API protocol.
 *
 * @see https://developer.friendlycaptcha.com/docs/v1/getting-started/verify
 */
class ValidatorV1 extends AbstractValidator implements ValidateInterface
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
        ]);

        $curl->post($this->config->getVerifyEndpoint(), [
            'solution' => $friendlyCaptchaSolution,
            'secret' => $this->config->getApikey(),
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
            && isset($response['success'], $response['errors'])
            && array_intersect($response['errors'], ['solution_missing', 'bad_request']);

        return $isResponseOk || $isSolutionMissingOrBadRequest;
    }
}
