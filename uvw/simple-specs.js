'use strict';

var path = require('path');
var fs = require('fs');
var utils = require('../lib/utils');
var yamlParser = require('../front/front-matter').yamlParser;
var nodeUtils = require('../node/utils');
var isFile = nodeUtils.isFile;
var mpUtils = require('../mp');

// TODO: make uvw, package.json, folder spec some json form (schema)

// SPEC {
//   rootType: <type>
//   baseDir: <path>
//   name: <name>
//   packageJson: <json>
//   meta: {
//     mtype: <mtype>
//     meta-proto: <meta-proto>
//     proto: <proto>
//   },
//   metaExt: <ext>
//   metaFile: <path>
//   root: {
//     homeDir: <path>
//     hashId: <id>
//   },
// }

exports.findRootSpec = findRootSpec;
function findRootSpec(fpath, opts) {
  var cwd = fpath ? path.resolve(fpath) : process.cwd();
  var f, spec, initPath = [];
  while (cwd && !(spec = rootSpec(cwd, opts))) {
    initPath.unshift(path.basename(cwd));
    var newd = path.resolve(cwd, '..');
    cwd = newd.length < cwd.length ? newd : null;
  }

  if (spec) spec.initPath = initPath;

  return spec;
};

exports.rootSpec = rootSpec;
function rootSpec (baseDir, opts) {
  opts = utils.assign({}, opts, { forRoot: true });
  // .uvw overrides package.json
  var spec;
  if (nodeUtils.isDir(baseDir, '.uvw')) {
    spec = uvwSpec(baseDir, opts);
    // .uvw with null spec probably means for local app storage/config use
  }
  if (!spec && isFile(baseDir, 'package.json')) {
    return packageSpec(baseDir, opts);
  }
  return spec;
}

exports.uvwSpec = uvwSpec;
function uvwSpec (baseDir, opts) {
  baseDir = path.resolve(baseDir);
  var spec = folderSpec(path.join(baseDir, '.uvw'), opts);
  if (spec) { // when there are ?meta.* in it
    spec.rootType = '.uvw';
    spec.baseDir = baseDir;
  }
  return spec;
}

exports.packageSpec = packageSpec;
function packageSpec (baseDir, opts) {
  baseDir = path.resolve(baseDir);
  var file = path.join(baseDir, 'package.json');
  var pkg = require(file);
  if (pkg.name && pkg.uvw) {
    var spec = typeof pkg.uvw === 'object' && pkg.uvw;
    if (spec) {
      utils.assert(spec.meta, 'package.json uvw without meta');
      spec = utils.assign({}, spec, { 
        metaExt: '.json',
        metaFile: file,
      });
    } else if (typeof pkg.uvw === 'string') {
      var main = path.resolve(baseDir, pkg.uvw);
      spec = folderSpec(main, opts);
    } else {
      spec = {};
    }

    spec.rootType = 'package.json';
    spec.baseDir = baseDir;
    spec.name = pkg.name;
    spec.packageJson = pkg;
    return spec;
  }
}

exports.folderSpec = folderSpec;
function folderSpec (dirPath, opts) {
  opts = opts || {};
  var ret, fpath;
  if (isFile(fpath = path.join(dirPath, 'meta', 'index.js'))) {
    ret = {
      ext: '.js',
      file: fpath,
    }
  } else if (isFile(fpath = path.join(dirPath, '_meta', 'index.js'))) {
    ret = {
      ext: '.js',
      file: fpath,
    }
  } else {
    ret = nodeUtils.hasFileExt(dirPath, '_meta', ['.js', '.json', '.yaml', '.mp']);
    ret = ret || nodeUtils.hasFileExt(dirPath, 'meta', ['.js', '.json', '.yaml', '.mp']);
  }

  if (ret) {
    ret = {
      metaExt: ret.ext,
      metaFile: ret.file,
    };
    if (opts.forRoot) {
      var p = path.resolve(ret.file, '..', 'root.json');
      if (isFile(p)) ret.root = require(p);
    }
    if (!opts.noMeta) {
      var ext = ret.metaExt;
      var file = ret.metaFile;
      var meta;
      if (ext === '.js') {
        meta = require(file);
      } else if (ext === '.json') {
        meta = require(file);
      } else if (ext === '.yaml') {
        var txt = fs.readFileSync(file, 'utf8');
        meta = txt.trim() ? yamlParser.safeLoad(txt) : {};
      } else if (ext === '.mp') {
        var front = mpUtils.mpFront(file);
        meta = front[0].data;
        meta._texts = front[0].texts;
        meta._sections = front.slice(1);
      }
      if (!meta) return;

      ret.meta = meta;
    }
  }
  return ret;
}

