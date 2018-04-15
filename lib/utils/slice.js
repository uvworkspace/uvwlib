'use strict';

// force copying to avoid leaking arguments
function slice (args, start, end) {
  var len = args.length;
  start = start > 0 ? start : 0;
  end = end >= 0 && end < len ? end : len;

  var n = end - start;
  if (n <= 0) return [];

  var ret = new Array(n);
  for (var i = 0; i < n; ++i) {
    ret[i] = args[i + start];
  }
  return ret;
}

module.exports = slice;
