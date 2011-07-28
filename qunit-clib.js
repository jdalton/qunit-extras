/*!
 * QUnit CLI Boilerplate
 * Copyright 2011 John-David Dalton <http://allyoucanleet.com/>
 * Based on the gist by Jörn Zaefferer <https://gist.github.com/722381>
 * Available under MIT license <http://mths.be/mit>
 */
;(function(global) {

  /** Add `console.log()` support for Narwhal, Rhino and Ringo */
  global.console || (global.console = { 'log': global.print });

  /** Reduce global.QUnit.QUnit -> global.QUnit */
  global.QUnit && (QUnit = QUnit.QUnit || QUnit);

  /*--------------------------------------------------------------------------*/

  /**
   * A bare-bones `Array#forEach` solution.
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} callback The function called per iteration.
   * @returns {Array} Returns the array iterated over.
   */
  function each(array, callback) {
    var index = -1,
        length = array.length;

    while (++index < length) {
      index in array && callback(array[index], index, array);
    }
    return array;
  }

  /*--------------------------------------------------------------------------*/

  /**
   * A logging callback triggered when all testing is completed.
   * @memberOf QUnit
   * @param {Object} details An object with properties `failed`, `passed`, 'runtime', and `total`.
   */
  function done(details) {
    // avoid a bug w/ `asyncTest()` and environments w/o timeouts calling `done()` twice
    if (!QUnit.doneCalled) {
      QUnit.doneCalled = true;
      console.log('----------------------------------------');
      console.log('    PASS: ' + details.passed + '  FAIL: ' + details.failed + '  TOTAL: ' + details.total);
      console.log('    Finished in ' + details.runtime + ' milliseconds.');
      console.log('----------------------------------------');
    }
  }

  /**
   * A logging callback triggered after every assertion.
   * @memberOf QUnit
   * @param {Object} details An object with properties `actual`, `expected`, `message`, and `result`.
   */
  function log(details) {
    var expected = details.expected,
        message = details.message || '',
        result = details.result,
        outcome = result ? 'PASS' : 'FAIL',
        type = typeof expected != 'undefined' ? 'EQ' : 'OK',
        response = !result && type == 'EQ' ? 'Expected: ' + expected + ', Actual: ' + details.actual : '';

    QUnit.config.testStats.assertions
      .push([outcome, type, message, response].join(' | '));
  }

  /**
   * A logging callback triggered at the start of every test module.
   * @memberOf QUnit
   * @param {Object} details An object with property `name`.
   */
  function moduleStart(details) {
    console.log('----------------------------------------');
    console.log(details.name);
    console.log('----------------------------------------');
  }

  /**
   * Converts an object into a string representation.
   * @memberOf QUnit
   * @type Function
   * @param {Object} object The object to stringify.
   * @returns {String} The result string.
   */
  var parseObject = (function() {
    var _parseObject = QUnit.jsDump.parsers.object;
    return function(object) {
      // fork to support Rhino's error objects
      if (typeof object.rhinoException == 'object') {
        return object.name +
          ' { message: "' + object.message +
          '", fileName: "' + object.fileName +
          '", lineNumber: ' + object.lineNumber + ' }';
      }
      return _parseObject(object);
    };
  }());

  /**
   * A logging callback triggered after a test is completed.
   * @memberOf QUnit
   * @param {Object} details An object with properties `failed`, `name`, `passed`, and `total`.
   */
  function testDone(details) {
    var assertions = QUnit.config.testStats.assertions,
        name = details.name;

    if (details.failed > 0) {
      console.log(' FAIL - '+ name);
      each(assertions, function(value) {
        console.log('    ' + value);
      });
    } else {
      console.log(' PASS - ' + name);
    }
    assertions.length = 0;
  }

  /*--------------------------------------------------------------------------*/

  /**
   * An object used to hold information about the current running test.
   * @memberOf QUnit.config
   * @type Object
   */
  QUnit.config.testStats = {

    /**
     * An array of test summaries (pipe separated).
     * @memberOf QUnit.config.testStats
     * @type Array
     */
    'assertions': []
  };

  // add shortcuts to the global
  // exclude `module` because some environments have it as a built-in object
  each(['asyncTest', 'deepEqual', 'equal', 'equals', 'expect', 'notDeepEqual',
        'notEqual', 'notStrictEqual', 'ok', 'raises', 'same', 'start', 'stop',
        'strictEqual', 'test'], function(name) {
    global[name] = QUnit[name];
  });

  // don't forget to call `QUnit.start()` from another file
  QUnit.done = done;
  QUnit.log = log;
  QUnit.moduleStart = moduleStart;
  QUnit.testDone = testDone;
  QUnit.jsDump.parsers.object = parseObject;
  QUnit.init();

}(typeof global == 'object' && global || this));