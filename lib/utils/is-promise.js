'use strict';

// REF: https://stackoverflow.com/a/38339199/918910
module.exports = function isPromise(val) {
  return Promise.resolve(val) === val;
};
