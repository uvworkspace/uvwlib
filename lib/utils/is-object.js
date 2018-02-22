'use strict';

function isObject (obj) {
  return !!obj && typeof obj === 'object' && !Array.isArray(obj);
}

module.exports = isObject;
