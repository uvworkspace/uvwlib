'use strict';

// MIT License, paulmillr.com github.com/paulmillr/micro-promisify
function promisify (fn) {
  if (typeof fn !== 'function') throw new TypeError('must receive a function');
  return Object.defineProperties(function () {
    var len = arguments.length;
    var args = new Array(len + 1);
    for (var i = 0; i < len; ++i) {
      args[i] = arguments[i]; // git.io/vk55A
    }
    return new Promise(function (resolve, reject) {
      args[len] = function (error, result) {
        return error == null ? resolve(result) : reject(error);
      };
      fn.apply(this, args);
    });
  }, {
    length: {value: Math.max(0, fn.length - 1)},
    name: {value: fn.name}
  });
}

module.exports = promisify;
