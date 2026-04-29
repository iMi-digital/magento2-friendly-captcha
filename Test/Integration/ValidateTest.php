<?php
declare(strict_types=1);

namespace IMI\FriendlyCaptcha\Test\Integration;

use IMI\FriendlyCaptcha\Model\Validate;
use IMI\FriendlyCaptcha\Model\Validator\ValidatorV1;
use IMI\FriendlyCaptcha\Model\Validator\ValidatorV2;
use Magento\Framework\App\ObjectManager;
use Magento\Framework\HTTP\Client\Curl;
use Magento\Framework\HTTP\Client\CurlFactory;
use PHPUnit\Framework\TestCase;

class ValidateTest extends TestCase
{
    private const CAPTCHA_SOLUTION = 'captcha-solution';
    private const SITE_KEY = 'test-site-key';
    private const API_KEY = 'test-api-key';

    /**
     * @magentoAppArea frontend
     * @magentoAppIsolation enabled
     * @magentoConfigFixture base_website imi_friendly_captcha/general/sitekey test-site-key
     * @magentoConfigFixture base_website imi_friendly_captcha/general/apikey test-api-key
     * @magentoConfigFixture base_website imi_friendly_captcha/general/endpoint 0
     */
    public function testValidateUsesValidatorV1ForV1Endpoint(): void
    {
        $curl = $this->createCurlMock();
        $curl->expects(self::once())
            ->method('post')
            ->with(
                'https://api.friendlycaptcha.com/api/v1/siteverify',
                [
                    'solution' => self::CAPTCHA_SOLUTION,
                    'secret' => self::API_KEY,
                    'sitekey' => self::SITE_KEY,
                ]
            );
        $curl->expects(self::once())
            ->method('getBody')
            ->willReturn('{"success":true}');
        $curl->expects(self::once())
            ->method('getStatus')
            ->willReturn(200);

        self::assertTrue($this->createValidateService($curl)->validate(self::CAPTCHA_SOLUTION));
    }

    /**
     * @magentoAppArea frontend
     * @magentoAppIsolation enabled
     * @magentoConfigFixture base_website imi_friendly_captcha/general/sitekey test-site-key
     * @magentoConfigFixture base_website imi_friendly_captcha/general/apikey test-api-key
     * @magentoConfigFixture base_website imi_friendly_captcha/general/endpoint 3
     */
    public function testValidateUsesValidatorV2ForV2Endpoint(): void
    {
        $curl = $this->createCurlMock();
        $curl->expects(self::once())
            ->method('setHeaders')
            ->with(['X-API-Key' => self::API_KEY]);
        $curl->expects(self::once())
            ->method('post')
            ->with(
                'https://global.frcapi.com/api/v2/captcha/siteverify',
                [
                    'response' => self::CAPTCHA_SOLUTION,
                    'sitekey' => self::SITE_KEY,
                ]
            );
        $curl->expects(self::once())
            ->method('getBody')
            ->willReturn('{"success":true}');
        $curl->expects(self::once())
            ->method('getStatus')
            ->willReturn(200);

        self::assertTrue($this->createValidateService($curl)->validate(self::CAPTCHA_SOLUTION));
    }

    /**
     * @magentoAppArea frontend
     * @magentoAppIsolation enabled
     * @magentoConfigFixture base_website imi_friendly_captcha/general/sitekey test-site-key
     * @magentoConfigFixture base_website imi_friendly_captcha/general/apikey test-api-key
     * @magentoConfigFixture base_website imi_friendly_captcha/general/endpoint 0
     */
    public function testValidateReturnsTrueWhenValidatorReturnsBadRequest(): void
    {
        $curl = $this->createCurlMock();
        $curl->expects(self::once())
            ->method('post')
            ->with(
                'https://api.friendlycaptcha.com/api/v1/siteverify',
                [
                    'solution' => self::CAPTCHA_SOLUTION,
                    'secret' => self::API_KEY,
                    'sitekey' => self::SITE_KEY,
                ]
            );
        $curl->expects(self::once())
            ->method('getBody')
            ->willReturn('{"errors":["bad_request"]}');
        $curl->expects(self::once())
            ->method('getStatus')
            ->willReturn(400);

        self::assertTrue($this->createValidateService($curl)->validate(self::CAPTCHA_SOLUTION));
    }

    /**
     * @magentoAppArea frontend
     * @magentoAppIsolation enabled
     * @magentoConfigFixture base_website imi_friendly_captcha/general/sitekey test-site-key
     * @magentoConfigFixture base_website imi_friendly_captcha/general/apikey test-api-key
     * @magentoConfigFixture base_website imi_friendly_captcha/general/endpoint 0
     */
    public function testValidateFailsOpenWhenCurlReturnsUnexpectedStatus(): void
    {
        $curl = $this->createCurlMock();
        $curl->expects(self::once())
            ->method('post')
            ->with(
                'https://api.friendlycaptcha.com/api/v1/siteverify',
                [
                    'solution' => self::CAPTCHA_SOLUTION,
                    'secret' => self::API_KEY,
                    'sitekey' => self::SITE_KEY,
                ]
            );
        $curl->expects(self::once())
            ->method('getBody')
            ->willReturn('{"success":true}');
        $curl->expects(self::once())
            ->method('getStatus')
            ->willReturn(500);

        self::assertTrue($this->createValidateService($curl)->validate(self::CAPTCHA_SOLUTION));
    }

    /**
     * @magentoAppArea frontend
     * @magentoAppIsolation enabled
     * @magentoConfigFixture base_website imi_friendly_captcha/general/sitekey test-site-key
     * @magentoConfigFixture base_website imi_friendly_captcha/general/apikey test-api-key
     * @magentoConfigFixture base_website imi_friendly_captcha/general/endpoint 0
     */
    public function testValidateFailsOpenWhenCurlReturnsMalformedJson(): void
    {
        $curl = $this->createCurlMock();
        $curl->expects(self::once())
            ->method('post')
            ->with(
                'https://api.friendlycaptcha.com/api/v1/siteverify',
                [
                    'solution' => self::CAPTCHA_SOLUTION,
                    'secret' => self::API_KEY,
                    'sitekey' => self::SITE_KEY,
                ]
            );
        $curl->expects(self::once())
            ->method('getBody')
            ->willReturn('not-json');
        $curl->expects(self::never())
            ->method('getStatus');

        self::assertTrue($this->createValidateService($curl)->validate(self::CAPTCHA_SOLUTION));
    }

    /**
     * @magentoAppArea frontend
     * @magentoAppIsolation enabled
     * @magentoConfigFixture base_website imi_friendly_captcha/general/sitekey test-site-key
     * @magentoConfigFixture base_website imi_friendly_captcha/general/apikey test-api-key
     * @magentoConfigFixture base_website imi_friendly_captcha/general/endpoint 3
     */
    public function testValidateFailsOpenWhenApiKeyIsRejected(): void
    {
        $curl = $this->createCurlMock();
        $curl->expects(self::once())
            ->method('setHeaders')
            ->with(['X-API-Key' => self::API_KEY]);
        $curl->expects(self::once())
            ->method('post')
            ->with(
                'https://global.frcapi.com/api/v2/captcha/siteverify',
                [
                    'response' => self::CAPTCHA_SOLUTION,
                    'sitekey' => self::SITE_KEY,
                ]
            );
        $curl->expects(self::once())
            ->method('getBody')
            ->willReturn('{"success":false,"errors":["secret_invalid"]}');
        $curl->expects(self::once())
            ->method('getStatus')
            ->willReturn(401);

        self::assertTrue($this->createValidateService($curl)->validate(self::CAPTCHA_SOLUTION));
    }

    private function createValidateService(Curl $curl): Validate
    {
        $objectManager = ObjectManager::getInstance();
        $curlFactory = $this->createMock(CurlFactory::class);
        $curlFactory->expects(self::once())
            ->method('create')
            ->willReturn($curl);

        return $objectManager->create(Validate::class, [
            'validatorByEndpoint' => [
                0 => $objectManager->create(ValidatorV1::class, ['curlFactory' => $curlFactory]),
                3 => $objectManager->create(ValidatorV2::class, ['curlFactory' => $curlFactory]),
            ],
        ]);
    }

    private function createCurlMock(): Curl
    {
        return $this->getMockBuilder(Curl::class)
            ->disableOriginalConstructor()
            ->onlyMethods(['post', 'setHeaders', 'getBody', 'getStatus'])
            ->getMock();
    }
}
