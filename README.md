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

## Upgrading from pre 4.0

Starting from version 4 we support V1 and V2 captchas. 
If you have own integrations, remove the template parameter in the blocks, because the block now automatically
pulls the correct v1 or v2 templates.

```xml
<block class="IMI\FriendlyCaptcha\Block\Frontend\FriendlyCaptcha" name="imi_friendly_captcha_widget_faq" after="-"
    <!-- template="IMI_FriendlyCaptcha::imi_friendly_captcha.phtml" -->
    ifconfig="imi_friendly_captcha/frontend/faq_form" />
```

The Javascript needs to use the new block instead of the generic Template.

```xml
<block class="IMI\FriendlyCaptcha\Block\Frontend\FriendlyCaptchaJs" name="friendly_captcha_js_forgot" ifconfig="imi_friendly_captcha/frontend/enabled"/>
```

## Development

The frontend widget and JS include templates are selected in the block classes based on the configured endpoint version:

- `IMI\FriendlyCaptcha\Block\Frontend\FriendlyCaptcha`
- `IMI\FriendlyCaptcha\Block\Frontend\FriendlyCaptchaJs`

Custom templates set explicitly in layout XML still take precedence.

### Pull Requests: Rebase Instead of Merging Back

When making a pull request, please allow "edits from maintainers".
Never merge master back into your branch, rebase instead.

### Run Github Actions Locally

We use [act](https://nektosact.com/installation/index.html) to run actions locally.

1. Follow the installation https://nektosact.com/installation/index.html#bash-script
2. Execute `bin/act`

### Updating the vendor code

#### v1

```bash
# v1
cd view/frontend/web/js/vendor
rm -r friendly-challenge
npm pack friendly-challenge
tar -xvf friendly-challenge-*.tgz
rm friendly-challenge-*.tgz
mv package friendly-challenge
```

#### v2

```bash
cd view/frontend/web/js/vendor
rm -r friendlycaptcha-sdk
npm pack @friendlycaptcha/sdk
tar -xvf friendlycaptcha-sdk-*.tgz
rm friendlycaptcha-sdk-*.tgz
mv package friendlycaptcha-sdk
rm -r friendlycaptcha-sdk/{src,docs,contrib}
```

Then make a pullrequest.

