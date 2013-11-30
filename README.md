# QUnit Extras <sup>v1.0.0</sup>

Extends QUnit with extra features and CLI support.

## Support

QUnit Extras has been tested in at least Node.js 0.6.21~0.10.22, Narwhal 0.3.2, PhantomJS 1.9.2, RingoJS 0.9, & Rhino 1.7RC5.

## Usage

```js
;(function(root) {
  'use strict';

  // use a single "load" function
  var load = typeof require == 'function' ? require : root.load;

  // load QUnit and extras if needed
  var QUnit = (function() {
    var noop = Function.prototype;
    return  root.QUnit || (
      root.addEventListener || (root.addEventListener = noop),
      root.setTimeout || (root.setTimeout = noop),
      root.QUnit = load('../vendor/qunit/qunit/qunit.js') || root.QUnit,
      (load('../vendor/qunit-extras/qunit-extras.js') || { 'runInContext': noop }).runInContext(root),
      addEventListener === noop && delete root.addEventListener,
      root.QUnit
    );
  }());

  // explicitly call `QUnit.module()` instead of `module()`
  // in case we are in a CLI environment
  QUnit.module('some test module');

  test('some test', function() {
    // ...
  });

  if (!root.document || root.phantom) {
    QUnit.start();
  }
}(typeof global == 'object' && global || this));
```

## Footnotes

  1. QUnit v1.3.0 and v1.12.0 are not supported by QUnit Extras CLI additions
  2. Rhino v1.7RC4 does not support timeout fallbacks `clearTimeout` and `setTimeout`

## Author

| [![twitter/jdalton](http://gravatar.com/avatar/299a3d891ff1920b69c364d061007043?s=70)](https://twitter.com/jdalton "Follow @jdalton on Twitter") |
|---|
| [John-David Dalton](http://allyoucanleet.com/) |
