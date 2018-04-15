'use strict';

// https://stackoverflow.com/questions/22697936/binary-search-in-javascript?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa

function bsearch(arr, val, key) {
  var pred = typeof val === 'function' ? val : (typeof key === 'string'
    ? function(item) { return val <= item[key]; }
    : function(item) { return val <= item; });

  var lo = -1, hi = arr.length;
  while (1 + lo !== hi) {
    var mi = lo + ((hi - lo) >> 1);
    if (pred(arr[mi])) {
      hi = mi;
    } else {
      lo = mi;
    }
  }
  return hi;
}

bsearch.lowerBound = bsearch; // assuming val not function
bsearch.upperBound = function(arr, val, key) {
  return typeof key === 'string'
       ? bsearch(arr, function(item) { return val < item[key]; })
       : bsearch(arr, function(item) { return val < item; });
}

module.exports = bsearch; 
