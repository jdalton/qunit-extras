# QUnit Extras v2.0.1

Extends QUnit with extra features and CLI support.

## Usage

```js
// Load QUnit and install extras.
var QUnit = require('qunit-extras');

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

## Support

Tested in Node.js 0.10-6.
