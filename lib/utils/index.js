'use strict';

module.exports = {
  assign: require('./assign'),
  defaults: require('./defaults'),
  assignSafe: require('./assign-safe'),
  assignExcept: require('./assign-except'),
  isObject: require('./is-object'),
  arrayLike: require('./array-like'),
  pick: require('./pick'),
  flatten: require('./flatten'),
  slice: require('./slice'),
  findAttr: require('./find-attr'),
  findIndex: require('./find-index'),
  class: require('./class'),
  inherit: require('./inherit'),

  proto: require('./proto'),
  protoize: require('./protoize'),
  subclass: require('./subclass'),
  instance: require('./instance')
};
