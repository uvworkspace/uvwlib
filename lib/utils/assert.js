'use strict';

var assert = function assert(b, msg) {
  if (b) return true;
  if (assert.THROWS) throw Error(msg || 'assert failed');
  console.error(msg || 'assert failed');
};

assert.THROWS = true;

module.exports = assert;
