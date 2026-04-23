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

## GraphQL Contact Mutation

Magento's `contactUs` GraphQL mutation is not protected by the normal Friendly Captcha frontend widget flow.

If you want to block that bypass completely, enable:

`Stores > Configuration > Security > Friendly Captcha > Frontend > Disable GraphQL contactUs mutation`

## Requirements

* PHP >= 8.1
* Magento >= 2.4.6

## Security Scan

This module is accepted by the Magento security scan by Adobe, which normally looks for Google ReCAPTCHA, i.e. replacing the ReCAPTCHA with the Friendly Captcha should not trigger any false positives.

## Development

### Run Github Actions locally

We use [act](https://nektosact.com/installation/index.html) to run actions locally.

1. Follow the installation https://nektosact.com/installation/index.html#bash-script
2. Execute `bin/act`

### Updating the vendor code

```bash
cd view/frontend/web/js/vendor
rm -r friendly-challenge
npm pack friendly-challenge
tar -xvf friendly-challenge-*.tgz
rm friendly-challenge-*.tgz
mv package friendly-challenge
```

Then make a pullrequest.
