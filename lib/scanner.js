'use strict';

var Scanner = {
  init: function(str) {
    this.src = str.toString();
    this.end = this.src.length;
    this.reset();
    return this;
  },

  reset: function() {
    this.start = 0;
    this.last = 0;
    this._matches = null;
    this._result = '';
  },

  source: function() {
    return this.src;
  },

  hasMore: function() {
    return this.start < this.end;
  },

  finished: function() {
    return this.start >= this.end;
  },

  peek: function(len) {
    if (len <= 0 || this.start >= this.end) return '';

    return this.src.slice(this.start, this.start + len);
  },

  remain: function() {
    if (this.start >= this.end) return '';

    return this.src.slice(this.start);
  },

  indexOf: function(str) {
    if (!str || this.start >= this.end) return -1;

    return this.src.indexOf(str, this.start);
  },

  scan: function(str) {
    if (!str || this.start >= this.end) return false;

    var len = str.length;
    if (this.peek(len) !== str) return false;

    this.last = this.start;
    this.start += len;
    this._result = str;
    return true;
  },

  nextLine: function() {
    if (this.last >= this.end) return '';

    var src = this.src, i = this.start;
    while (i < this.end && src[i] !== '\n') i++;

    this.last = this.start;
    this.start = i < this.end ? i+1 : i;
    return this._result = this.src.slice(this.last, this.start);
  },

  until: function(str) {
    var idx = this.indexOf(str);
    if (idx < 0) return false;

    this.last = this.start;
    this.start = idx;
    this._result = null;
    return true;
  },

  untilEnd: function() {
    this.last = this.start;
    this.start = this.end;
    this._result = null;
    return true;
  },

  // assume str has no leading newline
  untilLine: function(str) {
    if (!str || this.start >= this.end) return false;

    var len = str.length;
    if (this.peek(len) === str) {
      this._result = '';
      return true;
    }

    var src = this.src, ch;
    for (var start = this.start; start < this.end; start++) {
      if ((ch = src[start]) === '\n' || ch === '\r') {
        while (++start < this.end && ((ch = src[start]) === '\n' || ch === '\r'));
        if (start < this.end && src.slice(start, start+len) === str) {
          this.last = this.start;
          this.start = start;
          this._result = null;
          return true;
        }
      }
    }
    return false;
  },

  skip: function(str) {
    this._result = null;

    if (!str) return 0;

    var start = this.start; 
    if (str.length === 1) {
      while (start < this.end && this.src[start] === str) start++;
    } else {
      while (start < this.end && str.indexOf(this.src[start]) >= 0) start++;
    }

    var len = start - this.start;
    if (len > 0) {
      this.last = this.start;
      this.start = start;
    }
    return len;
  },

  match: function(regexp) {
    var matches = regexp.exec(this.remain());
    if (!matches || matches.index !== 0) return false;

    this.last = this.start;
    this.start += matches[0].length;
    this._result = null;
    this._matches = matches;
    return true;
  },

  untilMatch: function(regexp) {
    var matches = regexp.exec(this.remain());
    if (!matches) return false;
    
    this.last = this.start;
    this.start += matches.index;
    this._result = null;
    this._matches = this._matched = matches;
    return true;
  },

  scanMatched: function() {
    if (!this._matches || this._matched !== this._matches) return false;

    this.last = this.start;
    this.start += this._matches[0].length;
    this._result = this._matches[0];
    this._matched = null;
    return true;
  },

  getResult: function() {
    if (this._result === null) {
      this._result = this.src.slice(this.last, this.start);
    }
    return this._result;
  },
  getMatch: function(idx) {
    return this._matches && this._matches[idx > 0 ? idx : 0];
  },
};

module.exports = Scanner;
