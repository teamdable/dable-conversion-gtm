# Dable Conversion GTM Template

Easily install and manage Dable Conversion tracking code through Google Tag Manager (GTM) templates.

## 🚨 Important Notice

When using Purchase events, **you must create variables in GTM first**.

### Resolving "Unknown Variable" Warning
When you enter `{{purchase_value}}` or `{{purchase_currency}}` in the template, GTM may display an "unknown variable" warning. **This is normal behavior** and occurs because the variable has not been created in GTM yet.

**Resolution:**
1. Create variables in GTM first
2. Use `{{variable_name}}` in the template
3. Warning will automatically resolve

## Installation

1. Go to your GTM container and select **Tags** > **New**
2. Select **Tag Configuration** > **Community Template Gallery**
3. Search for "Dable Conversion" and select it
4. Complete required settings and save

## Key Features

### Supported Event Types

- **PageView**: Track page views
- **ViewContent**: Track content views
- **Search**: Track search events
- **Lead**: Track lead generation
- **CompleteRegistration**: Track registration completion
- **AddToCart**: Track add to cart actions
- **InitiateCheckout**: Track checkout initiation
- **Purchase**: Track purchase completion (value, currency parameters required)
- **Custom Event**: User-defined events (event1, event2, event3)

## Purchase Event Setup (Step-by-Step Guide)

### Step 1: Create GTM Variables (Required)

Before using Purchase events, you **must** create the following variables.

#### Method 1: Data Layer Variables (Recommended)

**Creating purchase_value variable:**
1. In GTM, click **Variables** > **New**
2. Select **Variable Configuration** > **Data Layer Variable**
3. **Variable Name**: `purchase_value`
4. **Data Layer Variable Name**: `purchase_value`
5. **Save**

**Creating purchase_currency variable:**
1. Click **Variables** > **New**
2. Select **Variable Configuration** > **Data Layer Variable**
3. **Variable Name**: `purchase_currency`
4. **Data Layer Variable Name**: `purchase_currency`
5. **Save**

### Step 2: Add Data Layer Code to Webpage

```javascript
// Execute on purchase completion page
dataLayer.push({
  'purchase_value': 15000,      // Actual purchase amount
  'purchase_currency': 'KRW',   // Currency code
  'event': 'purchase_completed' // Trigger event
});
```

### Step 3: Configure GTM Tag

1. **Tags** > **New** > **Dable Conversion**
2. **Service ID**: Enter your Dable Service ID
3. **Event Type**: Select Purchase
4. **Transaction Value**: `{{purchase_value}}`
5. **Currency**: `{{purchase_currency}}`

### Step 4: Set Up Trigger

1. **Triggers** > **New** > **Custom Event**
2. **Event Name**: `purchase_completed`
3. Connect this trigger to the tag

## Variable Setup Checklist

- [ ] Create `purchase_value` variable in GTM
- [ ] Create `purchase_currency` variable in GTM
- [ ] Add dataLayer.push() code to webpage
- [ ] Use `{{purchase_value}}`, `{{purchase_currency}}` in tag
- [ ] Complete trigger setup
- [ ] Test in GTM Preview mode

## Variable Usage Methods

### Method 1: Data Layer Variables (Recommended)

```javascript
// Execute on webpage
dataLayer.push({
  'purchase_value': orderData.totalAmount,
  'purchase_currency': orderData.currency,
  'transaction_id': orderData.orderId,
  'event': 'purchase_completed'
});
```

### Method 2: JavaScript Variables

You can dynamically retrieve values from DOM elements or JavaScript objects.

```javascript
// GTM Custom JavaScript Variable
function() {
  var priceElement = document.querySelector('.total-price');
  return priceElement ? priceElement.textContent.replace(/[^0-9]/g, '') : '';
}
```

### Method 3: DOM Element Variables

```html
<!-- HTML Example -->
<span id="order-total" data-value="15000">₩15,000</span>
<input type="hidden" id="currency" value="KRW">
```

**GTM Setup:**
1. **Variables** > **DOM Element**
2. **Selection Method**: CSS selector
3. **Element Selector**: `#order-total`
4. **Attribute Name**: `data-value`

## Testing Methods

### GTM Preview Mode

1. Click **Preview** in GTM
2. Trigger Purchase event on website
3. Check in GTM Preview window:
   - [ ] Verify variable values in Variables tab
   - [ ] Confirm Dable Conversion tag execution in Tags tab
   - [ ] Check data push in Data Layer tab

### Browser Developer Tools

```javascript
// Execute in console
console.log(dataLayer);           // Check data layer contents
console.log(window.dablena);      // Check dablena object
console.log('{{purchase_value}}'); // Check variable value (GTM Preview only)
```

## FAQ (Frequently Asked Questions)

### Q: "Unknown variable {{purchase_value}}" warning appears
**A:** This is normal. Create the variable in GTM first. The warning will disappear after variable creation.

### Q: Variable value shows as undefined
**A:** Check the following:
- Is dataLayer.push() code executed before tag execution?
- Are variable names case-sensitive and correct?
- Check Variables tab in GTM Preview mode

### Q: Purchase event is not being sent
**A:** Verify the essentials:
- Are both value and currency variables set?
- Is the trigger working properly?
- Check Dable script loading in Network tab

### Q: Can I use static values instead of dynamic values?
**A:** Yes, you can directly enter static values like `15000` instead of `{{purchase_value}}`.

### Q: Can I use variables for other events?
**A:** Only Purchase events support value and currency parameters. Other events don't require additional parameters.

## Troubleshooting

### Common Issues

1. **Variable value is empty string**
   ```javascript
   // Check dataLayer push timing
   window.addEventListener('load', function() {
     dataLayer.push({
       'purchase_value': getPurchaseValue(),
       'purchase_currency': 'KRW'
     });
   });
   ```

2. **Enable Debugging**
   - Check **Enable Debug Mode** in tag settings
   - Check detailed logs in browser console

3. **Network Verification**
   - Developer Tools > Network tab
   - Verify `dablena.min.js` loading
   - Check tracking requests

## Test Example Files

Test HTML files are provided in the `examples/` folder.

### purchase-test.html
Simple page for testing Purchase events.
- Generate Purchase events with button clicks
- Includes KRW, USD test cases
- Real-time DataLayer log monitoring

**Usage:**
1. Change `GTM-XXXXXXX` to actual GTM container ID
2. Create `purchase_value`, `purchase_currency` variables in GTM
3. Set up Dable Conversion tag and test

### basic-events.html
Page for testing basic events.
- PageView, ViewContent, Search, Lead, etc.
- Individual testing for each event type

### custom-events.html
Test page for custom events (event1, event2, event3).
- Test custom events selectable in template

## Developer Information

### Template Permissions

This GTM template requests the following permissions:

#### 1. Global Variable Access (`access_globals`)
- `dablena`: Dable Conversion main object (read/write/execute)
- `__dablena_gtm_loaded`: Loading status flag (read/write)
- `dablena.q`: Command queue array (read/write)

#### 2. Script Injection (`inject_script`)
- `https://static.dable.io/dist/*`: Dable Conversion script loading

#### 3. Logging (`logging`)
- **Environment**: Active only in debug mode

### Developer API Usage

The following GTM APIs are available in template code:

```javascript
// Basic GTM APIs
const copyFromWindow = require('copyFromWindow');
const setInWindow = require('setInWindow');
const injectScript = require('injectScript');
const makeTableMap = require('makeTableMap');
const log = require('logToConsole');
const createArgumentsQueue = require('createArgumentsQueue');

```

### Security Considerations

- All permissions are restricted to **minimum required scope only**
- External scripts are limited to **Dable domain only**
- Logging is active **only in debug mode**

### Template Modification Guidelines

1. **Adding Permissions**: Add corresponding permissions to `___WEB_PERMISSIONS___` section when using new APIs
2. **Test Updates**: Update test cases in `___TESTS___` section when changing code
3. **Security Review**: Verify that additional permissions are within minimum required scope

## Related Documentation

- [GTM Data Layer Guide](https://developers.google.com/tag-platform/tag-manager/datalayer)
- [GTM Variables Documentation](https://support.google.com/tagmanager/answer/7683056)
- [GTM Custom Variables](https://support.google.com/tagmanager/answer/7683362)
- [GTM E-commerce Tracking](https://developers.google.com/analytics/devguides/collection/ga4/set-up-ecommerce)
- [GTM Custom Templates](https://developers.google.com/tag-platform/tag-manager/templates)
- [GTM Sandboxed JavaScript](https://developers.google.com/tag-platform/tag-manager/templates/sandboxed-javascript)

## Support

For questions or technical issues, please contact Dable customer support team.