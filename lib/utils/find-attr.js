'use strict';

module.exports = function findAttr (arr, name, val) {
  for (var i=0, n=arr.length; i<n; i++) {
    var obj = arr[i];
    if (obj && obj[name] === val) return obj;
  }
};
