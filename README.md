# IMI FriendlyCaptcha

## Installing on Magento 2

**1. Install using composer**

From command line: 

```
composer require imi/magento2-friendly-captcha
php bin/magento module:enable IMI_FriendlyCaptcha
php bin/magento setup:upgrade
```

**2. Generate site key**

https://friendlycaptcha.com/signup

**3. Enable and configure from your Magento backend config**

Stores > Configuration > Security > Friendly Captcha

## Frontend

IMI_FriendlyCaptcha adds a Friendly Captcha widget to:

- Login
- Register
- Contact form
- Forgot password
- Send to Friend
- Newsletter signup*
- Product Reviews

*If you are not using the Magento Newsletter function, please disable the Newsletter Captcha in the settings - otherwise it would still be loaded on each page and later removed via JavaScript.

## Security Scan

This module is accepted by the Magento security scan by Adobe, which normally looks for Google ReCAPTCHA, i.e. replacing the ReCAPTCHA with the Friendly Captcha should not trigger any false positives.
