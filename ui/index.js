'use strict';

var utils = require('../lib/utils');

module.exports = utils.assign({},
  require('./dom'),
  require('./asset-loader'));
