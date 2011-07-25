# QUnit CLIB *(command-line interface boilerplate)*

A file that smooths over some of the rough edges of QUnit's CLI support.

## Setup

~~~ js
  // the path to QUnit is set at the top of qunit-clib.js
  var path = '/path/to/qunit.js';
~~~

## Usage

~~~ js
  // loads QUnit CLIB in Narwhal, Node.js, Rhino and Ringo
  (this.QUnit && function(){} ||
   typeof require == 'function' && require ||
   typeof load == 'function' && load)('../path/to/qunit-clib.js');
~~~

## Cloning this repo

To clone this repository just use:

~~~ bash
git clone https://github.com/jdalton/qunit-clib.git
cd qunit-clib
~~~

Feel free to fork if you see possible improvements!

## Authors

* [John-David Dalton](http://allyoucanleet.com/)
  [![twitter/jdalton](http://gravatar.com/avatar/299a3d891ff1920b69c364d061007043?s=70)](https://twitter.com/jdalton "Follow @jdalton on Twitter")