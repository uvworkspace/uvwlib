'use strict';

function arrayLike (obj) {
  return !!obj && typeof obj === 'object' && obj.length >= 0;
}

module.exports = arrayLike;
