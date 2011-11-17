# QUnit CLIB *(command-line interface boilerplate)*

QUnit CLIB helps extend QUnit's CLI support to many common CLI environments<sup><a name="fnref1" href="#fn1">1</a></sup>.

## Usage

~~~ js
(function(window) {

  // use a single load function
  var load = typeof require == 'function' ? require : window.load;

  // load QUnit and CLIB if needed
  var QUnit =
    window.QUnit || (
      window.setTimeout || (window.addEventListener = window.setTimeout = / /),
      window.QUnit = load('path/to/qunit.js') || window.QUnit,
      load('path/to/qunit-clib.js'),
      window.addEventListener.test && delete window.addEventListener,
      window.QUnit
    );

  // must explicitly use `QUnit.module` instead of `module()`
  // in case we are in a CLI environment
  QUnit.module('A Test Module');

  test('A Test', function() {
    // ...
  });

  // explicitly call `QUnit.start()` in a CLI environment
  if (!window.document) {
    QUnit.start();
  }
}(typeof global == 'object' && global || this));
~~~

## Cloning this repo

To clone this repository just use:

~~~ bash
git clone https://github.com/jdalton/qunit-clib.git
cd qunit-clib
~~~

Feel free to fork if you see possible improvements!

## Footnotes

  1. QUnit CLIB has been tested in at least Node.js 0.4.2, Narwhal 0.3.2, Ringo 0.7, and Rhino 1.7RC3.
     <a name="fn1" title="Jump back to footnote 1 in the text." href="#fnref1">&#8617;</a>

## Authors

* [John-David Dalton](http://allyoucanleet.com/)
  [![twitter/jdalton](http://gravatar.com/avatar/299a3d891ff1920b69c364d061007043?s=70)](https://twitter.com/jdalton "Follow @jdalton on Twitter")