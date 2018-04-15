'use strict';

// somewhere from stackoverflow

function encodeUtf8(s) {
  return unescape(encodeURIComponent(s));
}

function decodeUtf8(s) {
  return decodeURIComponent(escape(s));
}

function str2ab(str) {
  var s = encodeUtf8(str);
  var buf = new ArrayBuffer(s.length); 
  var bufView = new Uint8Array(buf);
  for (var i=0, strLen=s.length; i<strLen; i++) {
    bufView[i] = s.charCodeAt(i);
  }
  return bufView;
}

function ab2str(buf) {
   var str = "";
   var ab = new Uint8Array(buf);
   var abLen = ab.length;
   var CHUNK_SIZE = Math.pow(2, 16);
   var offset, len, subab;
   for (offset = 0; offset < abLen; offset += CHUNK_SIZE) {
      len = Math.min(CHUNK_SIZE, abLen-offset);
      subab = ab.subarray(offset, offset+len);
      str += decodeUtf8(String.fromCharCode.apply(null, subab));
   }
   return str;
}

module.exports = {
  encodeUtf8: encodeUtf8,
  decodeUtf8: decodeUtf8,
  str2ab: str2ab,
  ab2str: ab2str
};
