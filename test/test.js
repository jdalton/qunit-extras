;(function() {

  /** Used as a safe reference for `undefined` in pre ES5 environments */
  var undefined;

  // used as reference to the global object
  var root = typeof global == 'object' && global || this;

  // used as a no-op function
  var noop = Function.prototype;

  // use a single "load" function
  var load = (typeof require == 'function' && !(root.define && define.amd))
    ? require
    : (!root.document && root.java && root.load) || noop;

  // load QUnit in a way to workaround cross-environment issues
  var QUnit = root.QUnit || (root.QUnit = (
    root.addEventListener || (root.addEventListener = noop),
    root.setTimeout || (root.setTimeout = noop),
    QUnit = load('../node_modules/qunitjs/qunit/qunit.js') || root.QUnit,
    addEventListener === noop && delete root.addEventListener,
    QUnit = QUnit.QUnit || QUnit
  ));

  // load and install QUnit Extras
  var qe = load('../qunit-extras.js');
  if (qe) {
    qe.runInContext(root);
  }

  /*--------------------------------------------------------------------------*/

  // call `QUnit.module()` instead of `module()` when in a CLI
  QUnit.module('qunit-extras');

  QUnit.test('Some test with a title', 4, function() {
    equal(1, 1, 'foo');
    equal(2, 2, 'bar');
    equal('a', 'a', 'baz');
    equal('b', 'b', 'qux');
  });

  QUnit.test('Some other test with a title', 4, function() {
    equal(1, 2, 'foo');
    equal(2, 2, 'bar');
    equal('a', 'a', 'baz');
    equal('b', 'b', 'qux');
  });

  /*--------------------------------------------------------------------------*/

  QUnit.config.asyncRetries = 10;
  QUnit.config.hidepassed = true;

  if (!root.document || root.phantom) {
    QUnit.config.noglobals = true;
    QUnit.load();
  }
}.call(this));
