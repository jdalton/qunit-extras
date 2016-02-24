# QUnit Extras v1.5.0

Extends QUnit with extra features and CLI support.

## Usage

```js
;(function() {

  // Used as reference to the global object.
  var root = (typeof global == 'object' && global) || this;

  // Used as a no-op function.
  var noop = Function.prototype;

  // Use a single "load" function.
  var load = (typeof require == 'function' && !(root.define && define.amd))
    ? require
    : (!root.document && root.java && root.load) || noop;

  // Load QUnit in a way to workaround cross-environment issues.
  var QUnit = root.QUnit || (root.QUnit = (
    root.addEventListener || (root.addEventListener = noop),
    root.setTimeout || (root.setTimeout = noop),
    QUnit = load('path/to/qunit.js') || root.QUnit,
    addEventListener === noop && delete root.addEventListener,
    QUnit = QUnit.QUnit || QUnit
  ));

  // Load QUnit Extras.
  var qe = load('path/to/qunit-extras.js');
  if (qe) {
    qe.runInContext(root);
  }

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

  QUnit.module('some test module');

  QUnit.test('some test', function() {
    // ...
  });

  // Depending on the version of `QUnit` call either `QUnit.start()` or `QUnit.load()`
  // when in a CLI or PhantomJS.
  if (!root.document || root.phantom) {
    QUnit.load();
  }
}.call(this));
```

## Footnotes

  1. QUnit v1.3.0 and v1.12.0-v1.15.0 are not fully supported by QUnit Extras CLI additions
  2. Rhino v1.7RC4 does not support timeout fallbacks `clearTimeout` and `setTimeout`

## Support

Tested in Node.js 0.10, 0.12, 4, & 5.
