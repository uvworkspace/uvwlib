'use strict';

function nop() {}

function chunker(opts) {
  opts = opts || {};
  var sep = opts.sep || '\n';
  var chunkEnd = opts.chunkEnd;
  if (typeof chunkEnd !== 'string') {
    if (typeof sep === 'string') {
      chunkEnd = chunkEnd === undefined || chunkEnd ? sep : false;
    } else { // RegEx, not applicable
      chunkEnd = false;
    }
  }
  var preHandler = opts.preHandler;
  var handler = opts.handler || nop;
  var ender = opts.ender || nop;
  var prefix = '';
  var chunks = opts.chunks === true ? [] : opts.chunks;

  function push(s) {
    if (s.indexOf(sep) < 0) {
      prefix += s;
    } else {
      var cks = s.split(sep);
      var len = cks.length;

      prefix += cks[0];
      _push(prefix);

      for (var i=1; i<len-1; i++) {
        _push(cks[i]);
      }

      prefix = cks[len-1]; 
    }
  }

  function _push(chunk) {
    if (chunkEnd) chunk += chunkEnd;
    if (preHandler) chunk = preHandler(chunk);
    if (chunks) chunks.push(chunk);
    handler(chunk);
  }

  function end() {
    if (prefix) _push(prefix);

    prefix = '';
    return ender(chunks);
  }

  return Object.create({
    push: push,
    end: end
  });
}

module.exports = chunker;
