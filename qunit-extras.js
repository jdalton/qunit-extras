/*!
 * QUnit Extras v1.5.0
 * Copyright 2011-2016 John-David Dalton <http://allyoucanleet.com/>
 * Based on a gist by Jörn Zaefferer <https://gist.github.com/722381>
 * Available under MIT license <http://mths.be/mit>
 */
;(function() {

  /** Used as a safe reference for `undefined` in pre ES5 environments. */
  var undefined;

  /** Used for built-in method references. */
  var arrayProto = Array.prototype;

  /** Built-in value references. */
  var push = arrayProto.push,
      slice = arrayProto.slice,
      unshift = arrayProto.unshift;

  /** Detect environment objects. */
  var phantom = root.phantom ,
      document = !phantom && root.document,
      process = phantom || root.process;

  /** Detect environment flags. */
  var isNode = isObject(process) && typeof process.on == 'function',
      isPhantomPage = typeof root.callPhantom == 'function',
      isSilent = document && !isPhantomPage,
      isWindows = isNode && process.platform == 'win32';

  /** Detect if ANSI escape codes are supported. */
  var isAnsiSupported = (function() {
    if (isNode && process.stdout && !process.stdout.isTTY) {
      return false;
    }
    if (isWindows || getEnv('COLORTERM')) {
      return true;
    }
    return /^(?:ansi|cygwin|linux|screen|xterm|vt100)$|color/i.test(getEnv('TERM'));
  }());

  /** Used as a horizontal rule in console output. */
  var hr = '----------------------------------------';

  /** Used to display the wait throbber. */
  var throbberDelay = 500,
      waitCount = -1;

  /** Used to match HTML entities. */
  var reEscapedHtml = /(&amp;|&lt;|&gt;|&quot;|&#39;)/g;

  /** Used to match parts of the assert message. */
  var reDied = /^Died on test #\d+/,
      reMessage = /^<span class='test-message'>([\s\S]*?)<\/span>/;

  /** Used to associate color names with their corresponding codes. */
  var ansiCodes = {
    'bold': 1,
    'green': 32,
    'magenta': 35,
    'red': 31
  };

  /** Used to convert HTML entities to characters. */
  var htmlUnescapes = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'"
  };

  /** Used to determine if values are of the language type Object. */
  var objectTypes = {
    'function': true,
    'object': true
  };

  /** Detect free variable `exports`. */
  var freeExports = (objectTypes[typeof exports] && exports && !exports.nodeType)
    ? exports
    : undefined;

  /** Detect free variable `module`. */
  var freeModule = (objectTypes[typeof module] && module && !module.nodeType)
    ? module
    : undefined;

  /** Detect the popular CommonJS extension `module.exports`. */
  var moduleExports = (freeModule && freeModule.exports === freeExports)
    ? freeExports
    : undefined;

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = checkGlobal(freeExports && freeModule && typeof global == 'object' && global);

  /** Detect free variable `self`. */
  var freeSelf = checkGlobal(objectTypes[typeof self] && self);

  /** Detect free variable `window`. */
  var freeWindow = checkGlobal(objectTypes[typeof window] && window);

  /** Detect `this` as the global object. */
  var thisGlobal = checkGlobal(objectTypes[typeof this] && this);

  /**
   * Used as a reference to the global object.
   *
   * The `this` value is used if it's the global object to avoid Greasemonkey's
   * restricted `window` object, otherwise the `window` object is used.
   */
  var root = freeGlobal ||
    ((freeWindow !== (thisGlobal && thisGlobal.window)) && freeWindow) ||
      freeSelf || thisGlobal || Function('return this')();

  /*--------------------------------------------------------------------------*/

  /**
   * Checks if `value` is a global object.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {null|Object} Returns `value` if it's a global object, else `null`.
   */
  function checkGlobal(value) {
    return (value && value.Object === Object) ? value : null;
  }

  /**
   * Adds text color to the terminal output of `string`.
   *
   * @private
   * @param {string} colorName The name of the color to add.
   * @param {string} string The string to add colors to.
   * @returns {string} Returns the colored string.
   */
  function color(colorName, string) {
    return isAnsiSupported
      ? ('\x1B[' + ansiCodes[colorName] + 'm' + string + '\x1B[0m')
      : string;
  }

  /**
   * Checks if a given value is present in an array using strict equality
   * for comparisons, i.e. `===`.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {*} value The value to check for.
   * @returns {boolean} Returns `true` if the `value` is found, else `false`.
   */
  function includes(array, value) {
    var index = -1,
        length = array ? array.length : 0;

    while (++index < length) {
      if (array[index] === value) {
        return true;
      }
    }
    return false;
  }

  /**
   * Gets the environment variable value by a given name.
   *
   * @private
   * @param {string} name The name of the environment variable to get.
   * @returns {*} Returns the environment variable value.
   */
  function getEnv(name) {
    if (isNode) {
      return process.env[name];
    }
    if (phantom) {
      return require('system').env[name];
    }
  }

  /**
   * Checks if `value` is the language type of `Object`.
   * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an object, else `false`.
   */
  function isObject(value) {
    var type = typeof value;
    return !!value && (type == 'object' || type == 'function');
  }

  /**
   * Gets the last element of `array`.
   *
   * @private
   * @param {Array} array The array to query.
   * @returns {*} Returns the last element of `array`.
   */
  function last(array) {
    var length = array ? array.length : 0;
    return length ? array[length - 1] : undefined;
  }

  /**
   * Writes an inline message to standard output.
   *
   * @private
   * @param {string} [text=''] The text to log.
   */
  var logInline = (function() {
    if (!isNode || isWindows) {
      return function() {};
    }
    // Cleanup any inline logs when exited via `ctrl+c`.
    process.on('SIGINT', function() {
      logInline();
      process.exit();
    });

    var prevLine = '';
    return function(text) {
      var blankLine = repeat(' ', prevLine.length);
      if (text == null) {
        text = '';
      }
      if (text.length > hr.length) {
        text = text.slice(0, hr.length - 3) + '...';
      }
      prevLine = text;
      process.stdout.write(text + blankLine.slice(text.length) + '\r');
    }
  }());

  /**
   * Writes the wait throbber to standard output.
   *
   * @private
   */
  function logThrobber() {
    logInline('Please wait' + repeat('.', (++waitCount % 3) + 1));
  }

  /**
   * Creates a string with `text` repeated `n` number of times.
   *
   * @private
   * @param {string} text The text to repeat.
   * @param {number} n The number of times to repeat `text`.
   * @returns {string} The created string.
   */
  function repeat(text, n) {
    return Array(n + 1).join(text);
  }

  /**
   * Resolves the value of property `key` on `object`.
   *
   * @private
   * @param {Object} object The object to inspect.
   * @param {string} key The name of the property to resolve.
   * @returns {*} Returns the resolved value.
   */
  function result(object, key) {
    return object == null ? undefined : object[key];
  }

  /**
   * Converts the HTML entities `&amp;`, `&lt;`, `&gt;`, `&quot;`, and `&#39;`
   * in `string` to their corresponding characters.
   *
   * @private
   * @param {string} string The string to unescape.
   * @returns {string} Returns the unescaped string.
   */
  function unescape(string) {
    return string == null ? '' : String(string).replace(reEscapedHtml, unescapeHtmlChar);
  }

  /**
   * Used by `unescape` to convert HTML entities to characters.
   *
   * @private
   * @param {string} match The matched character to unescape.
   * @returns {string} Returns the unescaped character.
   */
  function unescapeHtmlChar(match) {
    return htmlUnescapes[match];
  }

  /**
   * Creates a function that provides `value` to the wrapper function as its
   * first argument. Additional arguments provided to the function are appended
   * to those provided to the wrapper function. The wrapper is executed with
   * the `this` binding of the created function.
   *
   * @private
   * @param {*} value The value to wrap.
   * @param {Function} wrapper The wrapper function.
   * @returns {Function} Returns the new function.
   */
  function wrap(value, wrapper) {
    return function() {
      var args = [value];
      push.apply(args, arguments);
      return wrapper.apply(this, args);
    };
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Installs extras on `QUnit`.
   *
   * @param {Object} QUnit The QUnit object.
   * @returns {Object} Returns `QUnit`.
   */
  function install(QUnit) {

    /**
     * The number of retries async tests have to succeed.
     *
     * @memberOf QUnit.config
     * @type number
     */
    QUnit.config.asyncRetries = 0;

    /**
     * An object of excused tests and assertions.
     *
     * @memberOf QUnit.config
     * @type Object
     */
    QUnit.config.excused = {};

    /**
     * An object used to hold "extras" information about the current running test.
     *
     * @memberOf QUnit.config
     * @type Object
     */
    QUnit.config.extrasData = {

      /**
       * The data object for the active test module.
       *
       * @memberOf QUnit.config.extrasData
       * @type Object
       */
      'module': {},

      /**
       * The data object for Sauce Labs.
       *
       * @memberOf QUnit.config.extrasData
       * @type Object
       */
      'sauce': {

        /**
         * An array of failed test details.
         *
         * @memberOf QUnit.config.extrasData.sauce
         * @type Array
         */
        'tests': []
      }
    };

    /**
     * Converts an object into a string representation.
     *
     * @memberOf QUnit
     * @type Function
     * @param {Object} object The object to stringify.
     * @returns {string} The result string.
     */
    QUnit.jsDump.parsers.object = (function() {
      var func = QUnit.jsDump.parsers.object;
      if (isSilent) {
        return func;
      }
      return function(object) {
        if (typeof object.rhinoException != 'object') {
          return func(object);
        }
        return object.name +
          ' { message: "' + object.message +
          '", fileName: "' + object.fileName +
          '", lineNumber: ' + object.lineNumber + ' }';
      };
    }());

    /**
     * Converts a number into a string.
     *
     * **Note:** This prevents a JIT bug in Safari 9.
     *
     * @memberOf QUnit
     * @type Function
     * @param {number} number The number to stringify.
     * @returns {string} The result string.
     */
    QUnit.jsDump.parsers.number = String;

    /*------------------------------------------------------------------------*/

    // Add a callback to be triggered after every assertion.
    QUnit.log(function(details) {
      QUnit.config.extrasData.module.logs.push(details);
    });

    // Add a callback to be triggered at the start of every test module.
    QUnit.moduleStart(function(details) {
      var module = QUnit.config.extrasData.module;
      module.name = details.name;
      module.logs = [];
      module.printed = false;
    });

    // Wrap to intercept `expected` and `message`.
    if (QUnit.push) {
      QUnit.push = wrap(QUnit.push, function(push, result, actual, expected, message) {
        push.apply(this, slice.call(arguments, 1));

        var item = last(QUnit.config.current.assertions);
        item.expected = QUnit.jsDump.parse(expected);
        item.text = message;
      });
    }
    if (QUnit.pushResult) {
      QUnit.pushResult = wrap(QUnit.pushResult, function(pushResult, details) {
        pushResult.apply(this, slice.call(arguments, 1));

        var item = last(QUnit.config.current.assertions);
        item.expected = QUnit.jsDump.parse(details.expected);
        item.text = details.message;
      });
    }
    // Wrap to intercept `message`.
    if (QUnit.pushFailure) {
      QUnit.pushFailure = wrap(QUnit.pushFailure, function(pushFailure, message) {
        pushFailure.apply(this, slice.call(arguments, 1));

        var item = last(QUnit.config.current.assertions);
        item.expected = '';
        item.text = message;
      });
    }
    // Wrap to flag tests using `assert.async`.
    if (QUnit.assert.async) {
      QUnit.assert.async = wrap(QUnit.assert.async, function(async) {
        this.test.usesAsync = true;
        return async.apply(this, slice.call(arguments, 1));
      });
    }
    // Add a callback to be triggered at the start of every test.
    QUnit.testStart(function(details) {
      var config = QUnit.config,
          test = config.current;

      var excused = config.excused || {},
          excusedTests = excused[details.module],
          excusedAsserts = excusedTests && excusedTests[details.name];

      // Allow async tests to retry.
      if (!test.retries) {
        test.retries = 0;
        test.finish = wrap(test.finish, function(finish) {
          if (this.async || this.usesAsync) {
            var asserts = this.assertions,
                config = QUnit.config,
                index = -1,
                length = asserts.length,
                logs = config.extrasData.module.logs,
                queue = config.queue;

            while (++index < length) {
              var assert = asserts[index];
              if (!assert.result && this.retries < config.asyncRetries) {
                var oldLength = queue.length;
                logs.length -= asserts.length;
                asserts.length = 0;

                this.retries++;
                this.queue();

                unshift.apply(queue, queue.splice(oldLength, queue.length - oldLength));
                return;
              }
            }
          }
          finish.apply(this, slice.call(arguments, 1));
        });
      }
      // Exit early when there is nothing to excuse.
      if (!excusedAsserts) {
        return;
      }
      // Excuse the entire test.
      if (excusedAsserts === true) {
        test.async = test.usesAsync = false;
        test.callback = function() {};
        test.expected = 0;
        return;
      }
      // Wrap to intercept `expected` and `message`.
      if (test.push) {
        test.push = wrap(test.push, function(push, result, actual, expected, message) {
          push.apply(this, slice.call(arguments, 1));

          var item = last(this.assertions);
          item.expected = QUnit.jsDump.parse(expected);
          item.text = message;
        });
      }
      if (test.pushResult) {
        test.pushResult = wrap(test.pushResult, function(pushResult, details) {
          pushResult.apply(this, slice.call(arguments, 1));

          var item = last(this.assertions);
          item.expected = QUnit.jsDump.parse(details.expected);
          item.text = details.message;
        });
      }
      // Wrap to intercept `message`.
      if (test.pushFailure) {
        test.pushFailure = wrap(test.pushFailure, function(pushFailure, message) {
          pushFailure.apply(this, slice.call(arguments, 1));

          var item = last(this.assertions);
          item.expected = '';
          item.text = message;
        });
      }
      // Wrap to excuse specific assertions.
      test.finish = wrap(test.finish, function(finish) {
        var asserts = this.assertions,
            config = QUnit.config,
            expected = this.expected,
            items = asserts.slice(),
            length = items.length;

        if (expected == null) {
          if (config.requireExpects) {
            expected = length;
            items.push('Expected number of assertions to be defined, but expect() was not called.');
          } else if (!length) {
            expected = 1;
            items.push('Expected at least one assertion, but none were run - call expect(0) to accept zero assertions.');
          }
        } else if (expected != length) {
          items.push('Expected ' + String(expected) + ' assertions, but ' + length + ' were run');
        }
        var index = -1;
        length = items.length;

        while (++index < length) {
          var assert = items[index],
              isStr = typeof assert == 'string';

          var assertMessage = isStr
            ? assert
            : ('text' in assert ? assert.text : unescape(result(reMessage.exec(assert.message), 1)));

          var assertValue = isStr ? assert : assert.expected,
              assertDied = result(reDied.exec(assertMessage), 0);

          if ((assertMessage && includes(excusedAsserts, assertMessage)) ||
              (assertDied && includes(excusedAsserts, assertDied)) ||
              (assertValue && (
                includes(excusedAsserts, assertValue) ||
                includes(excusedAsserts, assertValue.replace(/\s+/g, ''))
              ))) {
            if (isStr) {
              while (asserts.length < expected) {
                asserts.push({ 'result': true });
              }
              asserts.length = expected;
            }
            else {
              assert.result = true;
            }
          }
        }
        finish.apply(this, slice.call(arguments, 1));
      });
    });

    // Add a callback to be triggered after a test is completed.
    QUnit.testDone(function(details) {
      var config = QUnit.config,
          data = config.extrasData,
          failures = details.failed,
          hidepassed = config.hidepassed,
          module = data.module,
          moduleLogs = module.logs,
          sauceTests = data.sauce.tests;

      if (hidepassed && !failures) {
        return;
      }
      if (!isSilent) {
        logInline();
        if (!module.printed) {
          module.printed = true;
          console.log(hr);
          console.log(color('bold', module.name));
          console.log(hr);
        }
        console.log(' ' + (failures ? color('red', 'FAIL') : color('green', 'PASS')) + ' - ' + details.name);
      }
      if (!failures) {
        return;
      }
      var index = -1,
          length = moduleLogs.length;

      while(++index < length) {
        var entry = moduleLogs[index];
        if (hidepassed && entry.result) {
          continue;
        }
        var expected = entry.expected,
            result = entry.result,
            type = typeof expected != 'undefined' ? 'EQ' : 'OK';

        var message = [
          result ? color('green', 'PASS') : color('red', 'FAIL'),
          type,
          entry.message || 'ok'
        ];

        if (!result && type == 'EQ') {
          message.push(color('magenta', 'Expected: ' + String(expected) + ', Actual: ' + String(entry.actual)));
        }
        if (!isSilent) {
          console.log('    ' + message.join(' | '));
        }
        if (!entry.result) {
          sauceTests.push(entry);
        }
      }
    });

    // Add a callback to be triggered when all testing has completed.
    QUnit.done(function(details) {
      var failures = details.failed,
          statusColor = failures ? 'magenta' : 'green';

      if (!isSilent) {
        logInline();
        console.log(hr);
        console.log(color(statusColor, '    PASS: ' + details.passed + '  FAIL: ' + failures + '  TOTAL: ' + details.total));
        console.log(color(statusColor, '    Finished in ' + details.runtime + ' milliseconds.'));
        console.log(hr);
      }
      // Exit out of Node.js or PhantomJS.
      try {
        if (failures) {
          process.exit(1);
        } else {
          process.exit(0);
        }
      } catch(e) {}

      // Assign results to `global_test_results` for Sauce Labs.
      details.tests = QUnit.config.extrasData.sauce.tests;
      root.global_test_results = details;
    });

    /*------------------------------------------------------------------------*/

    // Replace poisoned `raises` method.
    if (QUnit['throws']) {
      QUnit.raises = QUnit['throws'];
    }
    if (QUnit.assert) {
      QUnit.assert.raises = QUnit.assert['throws'];
    }
    // Add CLI extras.
    if (!document) {
      // Start log throbber.
      if (!isSilent) {
        setInterval(logThrobber, throbberDelay);
      }
      if (QUnit.init) {
        // Must call `QUnit.start` in the test file if not loaded in a browser.
        QUnit.config.autostart = false;
        QUnit.init();
      }
    }
    return QUnit;
  }

  /*--------------------------------------------------------------------------*/

  // Export QUnit Extras.
  if (moduleExports) {
    freeModule.exports = install;
  } else {
    install(root.QUnit);
  }
}.call(this));
