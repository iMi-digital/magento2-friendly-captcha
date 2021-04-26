# IMI FriendlyCaptcha

## Installing on Magento2:

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

## Frontend:

IMI_FriendlyCaptcha adds a Friendly Captcha widget to:
- Login
- Register
- Contact form
- Forgot password
- Send to Friend
