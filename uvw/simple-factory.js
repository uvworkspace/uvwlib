'use strict';

var utils = require('../lib/utils');

var specs = require('./simple-specs');

var NilMeta = require('./nil-meta');
var DiskMeta = require('./disk-meta');

var MTYPES = {
  disk: DiskMeta,
};

var SimpleFactory = utils.class({
  createIndex: function(cntx) {
    var spec = cntx.spec;
    var ext = spec.metaExt, meta = spec.meta;
    var cls, p;
    if (ext === '.js') {
      cls = spec.meta;
      if (cls['meta-proto']) { // hack
        return cls['meta-proto'].instance().newIndex(cntx);
      }
    } else if (ext === '.json') {
      if (meta['meta-proto']) {
        p = cntx.filePath(meta['meta-proto']);
        return require(p).instance().newIndex(cntx);
      }

      if (meta.proto) {
        p = cntx.filePath(meta.proto);
        cls = require(p);
      } else if (meta.mtype) {
        cls = MTYPES[meta.mtype];
      }
    } else if (ext === '.yaml') {
      cls = meta.mtype && MTYPES[meta.mtype];
    } else if (ext === '.mp') {
      cls = meta.mtype && MTYPES[meta.mtype];
    }

    cls = cls || NilMeta;

    return cls.instance(cntx);
  },

  childSpec: function(cntx, name) {
    return specs.folderSpec(cntx.filePath(name));
  },
});

module.exports = SimpleFactory;
