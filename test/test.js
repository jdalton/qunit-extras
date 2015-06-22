;(function() {

  /** Used as reference to the global object. */
  var root = typeof global == 'object' && global || this;

  /** Used as a no-op function. */
  var noop = Function.prototype;

  /** Use a single "load" function. */
  var load = (typeof require == 'function' && !(root.define && define.amd))
    ? require
    : (!root.document && root.java && root.load) || noop;

  /** Load QUnit in a way to workaround cross-environment issues. */
  var QUnit = root.QUnit || (root.QUnit = (
    QUnit = load('qunitjs') || root.QUnit,
    QUnit = QUnit.QUnit || QUnit
  ));

  /** Load QUnit Extras. */
  var qe = load('../qunit-extras.js');
  if (qe) {
    qe.runInContext(root);
  }

  /*--------------------------------------------------------------------------*/

  QUnit.module('qunit-extras');

  QUnit.test('Some test with a title', 4, function() {
    strictEqual(1, 1, 'foo');
    strictEqual(2, 2, 'bar');
    strictEqual('a', 'a', 'baz');
    strictEqual('b', 'b', 'qux');
  });

  QUnit.test('Some other test with a title', 4, function() {
    strictEqual(1, 2, 'foo');
    strictEqual(2, 2, 'bar');
    strictEqual('a', 'a', 'baz');
    strictEqual('b', 'b', 'qux');
  });

  /*--------------------------------------------------------------------------*/

  QUnit.config.asyncRetries = 10;
  QUnit.config.hidepassed = true;

  if (!root.document || root.phantom) {
    QUnit.config.noglobals = true;
    QUnit.load();
  }
}.call(this));
