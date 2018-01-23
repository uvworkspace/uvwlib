'use strict';

const utils = require('./utils');

module.exports = {
  parse: function (env) {
    const NODE_ENV = env.NODE_ENV || 'development';
    const isProd = NODE_ENV === 'production';
    const isTest = NODE_ENV === 'test';
    const isDev = NODE_ENV === 'development';

    var config = {
      env: NODE_ENV,
      isProd: isProd,
      isTest: isTest,
      isDev: isDev
    };
    return utils.assignArgs(config, arguments, 1);
  },

  assign: utils.assign,

  num: function (str, otherwise) {
    return str && isFinite(Number(str)) ? Number(str) : otherwise;
  },
  val: function (str, otherwise) {
    return str || otherwise;
  },
  bool: function (str, otherwise) {
    if (str === 'no' || str === 'false') return false;
    if (str === 'yes' || str === 'true') return true;
    return otherwise;
  },

  // assertions
  assert: function (b, msg) {
    if (!b) throw Error(msg || 'error');
    return true;
  },
  assertNum: function (val, msg) {
    if (typeof val !== 'number' || !isFinite(val)) {
      throw Error(msg || 'not finite');
    }
    return true;
  }
};
