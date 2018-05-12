'use strict';

module.exports = {
  assign: require('./assign'),
  defaults: require('./defaults'),
  assignSafe: require('./assign-safe'),
  assignExcept: require('./assign-except'),
  isObject: require('./is-object'),
  arrayLike: require('./array-like'),
  deref: require('./deref'),
  pick: require('./pick'),
  flatten: require('./flatten'),
  map: require('./map'),
  each: require('./each'),
  slice: require('./slice'),
  findAttr: require('./find-attr'),
  findIndex: require('./find-index'),
  class: require('./class'),
  inherit: require('./inherit'),
  isPromise: require('./is-promise'),
  assert: require('./assert'),

  proto: require('./proto'),
  protoize: require('./protoize'),
  subclass: require('./subclass'),
  instance: require('./instance')
};
