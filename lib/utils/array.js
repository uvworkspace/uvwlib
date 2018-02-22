'use strict';

function array (obj) {
  return obj != null ? (Array.isArray(obj) ? obj : [obj]) : [];
}

module.exports = array;
