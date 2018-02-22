'use strict';

var uvwlib = require('./utils');

var indents = {
  0: '',
  2: '  ',
  4: '    ',
  6: '      ',
  8: '        ',
 10: '          ',
 12: '            ',
 14: '              ',
 16: '                ',
 18: '                  ',
 20: '                    '
};

var RESERVED = {
  files: 1,
  text: 1,
  file: 1,
  folder: 1,
  name: 1,
};

function nspace(n) {
  var s = indents[n];
  if (s == null) for (s=''; n>0; n--) s += ' ';
  return s;
}

function pushInfo(file, indent, arr) { 
  Object.keys(file).forEach(function(key) {
    if (!RESERVED[key]) {
      arr.push(nspace(indent) + '  ' + key + ': ' + file[key]);
    }
  });
}

function toYAML(zip, indent, arr) {
  for (var i=0; i<zip.files.length; i++) {
    var f = zip.files[i];
    if (f.name) {
      if (f.isZip) {
        arr.push(nspace(indent) + '- folder: ' + f.name);
        pushInfo(f, indent, arr);
        if (f.files.length) {
          arr.push(nspace(indent) + '  files:');
          toYAML(f, indent + 4, arr);
        }
      } else {
        arr.push(nspace(indent) + '- file: ' + f.name);
        pushInfo(f, indent, arr);
        if (typeof f.text === 'string') {
          arr.push(nspace(indent) + '  text: |2+');
          var lns = f.text.split('\n');
          for (var j=0; j<lns.length; j++) {
            arr.push(nspace(indent + 4) + lns[j]);
          }
        }
      }
    }
  }
  return arr;
}

function sort(files) {
  files.sort(function(f1, f2) {
    if (f1.isZip) {
      return f2.isZip && f1.name >= f2.name ? 1 : -1;
    } else {
      return f2.isZip || f1.name >= f2.name ? 1 : -1; 
    }
  });
  files.forEach(function(file) {
    if (file.isZip) sort(file.files);
  });
}

var Zip = uvwlib.class({
  isZip: true,

  init: function(name) {
    this.name = name || null;
    this.files = [];
    return this;
  },
  get: function(name) {
    return uvwlib.findAttr(this.files, 'name', name);
  },
  add: function(name, text, replace) {
    if (!name) throw Error('empty name');

    var got = this.get(name);
    if (got) {
      if (!replace) throw Error(name + ' exists');
      got.text = text;
    } else {
      this.files.push({
        name: name,
        text: text
      });
    }
    return this;
  },
  replace: function(name, text) {
    this.add(name, text, true);
  },
  info: function(name, opts, replace) {
    if (!name) throw Error('empty name');

    var got = this.get(name);
    if (got) {
      if (!replace) throw Error(name + ' exists');
    } else {
      this.files.push(got = { name: name });
    }

    Object.keys(opts).forEach(function(key) {
      if (!RESERVED[key]) got[key] = String(opts[key]);
    });
    return this;
  },

  dir: function(name, isAdd) {
    if (!name) throw Error('empty name');

    var zip = this.get(name);
    if (isAdd && zip) throw Error(name + ' exists');

    if (!zip) {
      zip = Zip.instance(name);
      this.files.push(zip);
    }
    return zip;
  },
  addDir: function(name) {
    return this.dir(name, true);
  },

  toJSON: function() {
    sort(this.files);
    return { 
      name: this.name || null,
      files: this.files.map(function(f) {
        return f.isZip ? f.toJSON() : f;
      })
    };
  },

  toYAML: function() {
    sort(this.files);
    var arr = toYAML(this, 0, []);
    return arr.join('\n');
  }
});

module.exports = Zip;
