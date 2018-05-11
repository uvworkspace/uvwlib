'use strict';

var nodeUtils = require('../node/utils');
var frontMatter = require('../front/front-matter');
var FrontWrapper = require('../front/front-wrapper');

function mpFile(fname) {
  return nodeUtils.readFile(fname, {
    defaultFile: 'index.mp',
    extName: '.mp'
  });
}

function mpFront(fname) {
  return frontMatter(mpFile(fname));
}

function mpFrontWrapper(fname) {
  return FrontWrapper.instance(mpFile(fname));
}

module.exports = {
  mpFile: mpFile,
  mpFront: mpFront,
  mpFrontWrapper: mpFrontWrapper,
};
