(function() {

  // used as reference to the global object
  var root = typeof global == 'object' && global || this;

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
      root.QUnit = load('../node_modules/qunitjs/qunit/qunit.js') || root.QUnit,
      addEventListener === noop && delete root.addEventListener,
      root.QUnit
    );
  }());

  // load and install QUnit Extras
  var qe = load('../qunit-extras.js');
  if (qe) {
    qe.runInContext(root);
  }

  // call `QUnit.module()` instead of `module()` when in a CLI
  QUnit.module('qunit-extras');

  test('Some test with a title', function() {
    equal(1, 1, 'foo');
    equal(2, 2, 'bar');
    equal('a', 'a', 'baz');
    equal('b', 'b', 'qux');
  });

  test('Some other test with a title', function() {
    equal(1, 2, 'foo');
    equal(2, 2, 'bar');
    equal('a', 'a', 'baz');
    equal('b', 'b', 'qux');
  });

  // call `QUnit.start()` when in a CLI or PhantomJS
  if (!root.document || root.phantom) {
    QUnit.start();
  }
}.call(this));
