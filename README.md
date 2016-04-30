# QUnit Extras v1.5.0

Extends QUnit with extra features and CLI support.

## Usage

```js
// Load QUnit and Extras.
var QUnit = require('qunit');
var QUnitExtras = require('qunit-extras');

// Hook into QUnit.
QUnitExtras.runInContext({ 'QUnit': QUnit });

// Set the number of retries an async tests may attempt.
QUnit.config.asyncRetries = 10;

// Excuse tests.
QUnit.config.excused = {
  // Specify the module name.
  'qunit module': {
    // Excuse individual asserts in a test.
    'a qunit test': [
      // Excuse by assert message.
      'assert message',
      // Excuse by expected result.
      '[1,2,3]',
      // Excuse by error indicator.
      'Died on test #1',
    ],
    // Excuse an entire test.
    'another qunit test': true
  }
};
```

## Footnotes

  1. QUnit v1.3.0 and v1.12.0-v1.15.0 are not fully supported by QUnit Extras CLI additions
  2. Rhino v1.7RC4 does not support timeout fallbacks `clearTimeout` and `setTimeout`

## Support

Tested in Node.js 0.10-6.
