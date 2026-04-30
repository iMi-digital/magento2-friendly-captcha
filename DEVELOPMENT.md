# Development

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

## V1 and V2 Templates

The frontend widget and JS include templates are selected in the block classes based on the configured endpoint version:

- `IMI\FriendlyCaptcha\Block\Frontend\FriendlyCaptcha`
- `IMI\FriendlyCaptcha\Block\Frontend\FriendlyCaptchaJs`

Custom templates set explicitly in layout XML still take precedence.

## Pull Requests: Rebase Instead of Merging Back

When making a pull request, please allow "edits from maintainers".
Never merge master back into your branch, rebase instead.

## Run Github Actions Locally

We use [act](https://nektosact.com/installation/index.html) to run actions locally.

1. Follow the installation https://nektosact.com/installation/index.html#bash-script
2. Execute `bin/act`

## Updating the vendor code

### v1

```bash
# v1
cd view/frontend/web/js/vendor
rm -r friendly-challenge
npm pack friendly-challenge
tar -xvf friendly-challenge-*.tgz
rm friendly-challenge-*.tgz
mv package friendly-challenge
```

### v2

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

