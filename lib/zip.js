'use strict';

var findAttr = require('./utils/find-attr');

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
  type: 1,
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

function toFront(zip, fpath, arr) {
  for (var i=0; i<zip.files.length; i++) {
    var f = zip.files[i];
    if (f.name) {
      var fp = fpath ? fpath + '/' + f.name : f.name;
      if (f.isZip) {
        arr.push('--- ' + fp);
        arr.push('type: folder');
        pushInfo(f, 0, arr);
        if (f.files.length) {
          toFront(f, fp, arr);
        }
      } else {
        arr.push('--- ' + (fpath ? fpath + '/' + f.name : f.name));
        arr.push('type: file');
        pushInfo(f, 0, arr);
        if (typeof f.text === 'string') {
          if (/^---/.test(f.text) || /\n---/.test(f.text)) {
            arr.push('--- |');
            var lns = f.text.split('\n');
            for (var j=0; j<lns.length; j++) {
              arr.push('  ' + lns[j]);
            }
          } else {
            arr.push('---');
            arr.push(f.text);
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

var Zip = {
  isZip: true,

  _factory: function(name) {
    return Object.create(Zip).init(name);
  },

  init: function(name) {
    this.name = name || null;
    this.files = [];
    return this;
  },
  get: function(name) {
    return findAttr(this.files, 'name', name);
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
      zip = this._factory(name);
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
    var arr = this.name ? ['name: ' + this.name] : [];
    toYAML(this, 0, arr)
    var last = arr[arr.length-1];
    if (last && last[last.length-1] !== '\n') arr.push('');
    return arr.join('\n');
  },

  toFront: function() {
    sort(this.files);
    var arr = this.name ? ['name: ' + this.name] : [];
    toFront(this, '', arr)
    var last = arr[arr.length-1];
    if (last && last[last.length-1] !== '\n') arr.push('');
    return arr.join('\n');
  }
};

module.exports = Zip;
