'use strict';

var QUnit = require('../qunit-extras');

QUnit.module('qunit-extras');

QUnit.test('Some test pass with a title', function(assert) {
  assert.expect(4);

  assert.strictEqual(1, 1, 'foo');
  assert.strictEqual(2, 2, 'bar');
  assert.strictEqual('a', 'a', 'baz');
  assert.strictEqual('b', 'b', 'qux');
});

QUnit.test('Some test fail with a title', function(assert) {
  assert.expect(4);

  assert.strictEqual(1, 2, 'foo');
  assert.strictEqual(2, 2, 'bar');
  assert.strictEqual('a', 'a', 'baz');
  assert.strictEqual('b', 'b', 'qux');
});

QUnit.config.asyncRetries = 10;
QUnit.config.hidepassed = true;
QUnit.config.noglobals = true;

QUnit.load();
QUnit.start();
