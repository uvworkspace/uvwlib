'use strict';

function findIndex (arr, name, val) {
  for (var i=0, n=arr.length; i<n; i++) {
    var obj = arr[i];
    if (obj && obj[name] === val) return i;
  }
  return -1;
}

module.exports = findIndex;
