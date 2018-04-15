'use strict';

// isobject <https://github.com/jonschlinkert/isobject>
// - Copyright (c) 2014-2017, Jon Schlinkert.
// - Released under the MIT License.
// - version: 3.0.1

module.exports = function isObject(val) {
  return val != null && typeof val === 'object' && Array.isArray(val) === false;
};
