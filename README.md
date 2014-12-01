# QUnit Extras v1.3.0

Extends QUnit with extra features and CLI support.

## Usage

```js
;(function() {

  // used as reference to the global object
  var root = (typeof global == 'object' && global) || this;

  // used as a no-op function
  var noop = Function.prototype;

  // use a single "load" function
  var load = (typeof require == 'function' && !(root.define && define.amd))
    ? require
    : (!root.document && root.java && root.load) || noop;

  // load QUnit in a way to workaround cross-environment issues
  var QUnit = (function() {
    return  root.QUnit || (
      root.addEventListener || (root.addEventListener = noop),
      root.setTimeout || (root.setTimeout = noop),
      root.QUnit = load('path/to/qunit.js') || root.QUnit,
      addEventListener === noop && delete root.addEventListener,
      root.QUnit
    );
  }());

  // load and install QUnit Extras
  var qe = load('path/to/qunit-extras.js');
  if (qe) {
    qe.runInContext(root);
  }

  // set the number of retries async tests may attempt
  QUnit.config.asyncRetries = 10;

  // excuse tests
  QUnit.config.excused = {
    // specify the module name
    'qunit module': {
      // excuse individual asserts in a test
      'a qunit test': [
        // excuse by assert message
        'assert message',

        // excuse by expected result
        '[1,2,3]',

        // excuse by error indicator
        'Died on test #1',
      ],
      // or excuse an entire test
      'another qunit test': true
    }
  };

  // call `QUnit.module()` instead of `module()` when in a CLI
  QUnit.module('some test module');

  test('some test', function() {
    // ...
  });

  // call `QUnit.start()` when in a CLI or PhantomJS
  if (!root.document || root.phantom) {
    QUnit.start();
  }
}.call(this));
```

## Footnotes

  1. QUnit v1.3.0 and v1.12.0-v1.14.0 are not fully supported by QUnit Extras CLI additions
  2. Rhino v1.7RC4 does not support timeout fallbacks `clearTimeout` and `setTimeout`

## Support

Tested in Node.js 0.8.26~0.10.33, PhantomJS 1.9.7, RingoJS 0.9, & Rhino 1.7RC5.

## Author

| [![twitter/jdalton](http://gravatar.com/avatar/299a3d891ff1920b69c364d061007043?s=70)](https://twitter.com/jdalton "Follow @jdalton on Twitter") |
|---|
| [John-David Dalton](http://allyoucanleet.com/) |

## Contributors

| [![twitter/demoneaux](http://gravatar.com/avatar/029b19dba521584d83398ada3ecf6131?s=70)](https://twitter.com/demoneaux "Follow @demoneaux on Twitter") | [![twitter/mathias](http://gravatar.com/avatar/24e08a9ea84deb17ae121074d0f17125?s=70)](https://twitter.com/mathias "Follow @mathias on Twitter") |
|---|---|
| [Benjamin Tan](http://d10.github.io/) | [Mathias Bynens](http://mathiasbynens.be/) |
