<?php

/**
 *  Copyright © iMi digital GmbH, based on work by MageSpecialist
 *  See LICENSE for license details.
 */

declare(strict_types=1);

namespace IMI\FriendlyCaptcha\Test\Integration;

use IMI\FriendlyCaptcha\Api\ValidateInterface;
use IMI\FriendlyCaptcha\Model\Validate;
use Magento\Contact\Model\Mail;
use Magento\Contact\Model\MailInterface;
use Magento\Framework\App\ObjectManager;
use Magento\Framework\App\Response\Http;
use Magento\TestFramework\TestCase\AbstractController;

class ContactFormProtectionTest extends AbstractController
{
    private const CAPTCHA_SOLUTION = 'valid-captcha-solution';
    private const INVALID_CAPTCHA_SOLUTION = 'invalid-captcha-solution';

    /**
     * @magentoAppArea frontend
     *
     * @magentoAppIsolation enabled
     *
     * @magentoConfigFixture base_website imi_friendly_captcha/general/sitekey test-site-key
     * @magentoConfigFixture base_website imi_friendly_captcha/general/apikey test-api-key
     * @magentoConfigFixture base_website imi_friendly_captcha/frontend/enabled 1
     * @magentoConfigFixture base_website imi_friendly_captcha/frontend/enabled_contact 1
     */
    public function testContactFormPostWithoutCaptchaSolutionIsRejectedAndDoesNotSendMail(): void
    {
        $validator = $this->createMock(ValidateInterface::class);
        $validator->expects(self::once())
            ->method('validate')
            ->with('')
            ->willReturn(false);

        $mail = $this->createMock(MailInterface::class);
        $mail->expects(self::never())
            ->method('send');

        $objectManager = ObjectManager::getInstance();
        $objectManager->addSharedInstance($validator, ValidateInterface::class);
        $objectManager->addSharedInstance($validator, Validate::class);
        $objectManager->addSharedInstance($mail, MailInterface::class);
        $objectManager->addSharedInstance($mail, Mail::class);

        $this->getRequest()->setMethod('POST');
        $this->getRequest()->setPostValue([
            'name' => 'Integration Test',
            'email' => 'integration@example.com',
            'telephone' => '0123456789',
            'comment' => 'This request should be stopped before the Magento contact controller sends email.',
        ]);

        $this->dispatch('contact/index/post');

        $response = $this->getResponse();
        self::assertTrue($response->isRedirect(), 'Contact form submission should redirect after captcha failure.');
        self::assertStringContainsString('contact/index', $this->getRedirectLocation($response));
    }

    /**
     * @magentoAppArea frontend
     *
     * @magentoAppIsolation enabled
     *
     * @magentoConfigFixture base_website imi_friendly_captcha/general/sitekey test-site-key
     * @magentoConfigFixture base_website imi_friendly_captcha/general/apikey test-api-key
     * @magentoConfigFixture base_website imi_friendly_captcha/frontend/enabled 1
     * @magentoConfigFixture base_website imi_friendly_captcha/frontend/enabled_contact 1
     */
    public function testContactFormPostWithInvalidCaptchaSolutionIsRejectedAndDoesNotSendMail(): void
    {
        $validator = $this->createMock(ValidateInterface::class);
        $validator->expects(self::once())
            ->method('validate')
            ->with(self::INVALID_CAPTCHA_SOLUTION)
            ->willReturn(false);

        $mail = $this->createMock(MailInterface::class);
        $mail->expects(self::never())
            ->method('send');

        $objectManager = ObjectManager::getInstance();
        $objectManager->addSharedInstance($validator, ValidateInterface::class);
        $objectManager->addSharedInstance($validator, Validate::class);
        $objectManager->addSharedInstance($mail, MailInterface::class);
        $objectManager->addSharedInstance($mail, Mail::class);

        $this->getRequest()->setMethod('POST');
        $this->getRequest()->setPostValue([
            'name' => 'Integration Test',
            'email' => 'integration@example.com',
            'telephone' => '0123456789',
            'comment' => 'This request should not send an email.',
            ValidateInterface::PARAM_FRIENDLY_CAPTCHA_SOLUTION => self::INVALID_CAPTCHA_SOLUTION,
        ]);

        $this->dispatch('contact/index/post');

        $response = $this->getResponse();
        self::assertTrue($response->isRedirect(), 'Contact form submission should redirect after captcha failure.');
        self::assertStringContainsString('contact/index', $this->getRedirectLocation($response));
    }

    /**
     * @magentoAppArea frontend
     *
     * @magentoAppIsolation enabled
     *
     * @magentoConfigFixture base_website imi_friendly_captcha/general/sitekey test-site-key
     * @magentoConfigFixture base_website imi_friendly_captcha/general/apikey test-api-key
     * @magentoConfigFixture base_website imi_friendly_captcha/frontend/enabled 1
     * @magentoConfigFixture base_website imi_friendly_captcha/frontend/enabled_contact 1
     */
    public function testContactFormPostWithValidCaptchaSolutionSendsMail(): void
    {
        $validator = $this->createMock(ValidateInterface::class);
        $validator->expects(self::once())
            ->method('validate')
            ->with(self::CAPTCHA_SOLUTION)
            ->willReturn(true);

        $mail = $this->createMock(MailInterface::class);
        $mail->expects(self::once())
            ->method('send')
            ->with(
                'integration@example.com',
                self::callback(static function (array $variables): bool {
                    return isset($variables['data'])
                        && $variables['data']->getName() === 'Integration Test'
                        && $variables['data']->getEmail() === 'integration@example.com'
                        && $variables['data']->getComment() === 'Captcha should allow this request.';
                })
            );

        $objectManager = ObjectManager::getInstance();
        $objectManager->addSharedInstance($validator, ValidateInterface::class);
        $objectManager->addSharedInstance($validator, Validate::class);
        $objectManager->addSharedInstance($mail, MailInterface::class);
        $objectManager->addSharedInstance($mail, Mail::class);

        $this->getRequest()->setMethod('POST');
        $this->getRequest()->setPostValue([
            'name' => 'Integration Test',
            'email' => 'integration@example.com',
            'telephone' => '0123456789',
            'comment' => 'Captcha should allow this request.',
            'hideit' => '',
            ValidateInterface::PARAM_FRIENDLY_CAPTCHA_SOLUTION => self::CAPTCHA_SOLUTION,
        ]);

        $this->dispatch('contact/index/post');

        self::assertTrue($this->getResponse()->isRedirect(), 'Contact form submission should complete normally.');
    }

    private function getRedirectLocation(Http $response): string
    {
        $locationHeader = $response->getHeader('Location');

        return (string) $locationHeader;
    }
}
