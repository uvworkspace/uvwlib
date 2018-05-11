'use strict';

function dispatch(obj, cmd, args, opts) {
  args = args || [];
  opts = opts || {};

  var fn, arg0, arg1;
  if (cmd === 'xbar') {
    arg0 = args[0] || 'info';
    arg1 = args[1];
    if (fn = arg1 && obj['xbar_' + arg0 + '_' + arg1]) {
      args = args.slice(2);
    } else if (fn = obj['xbar_' +  arg0]) {
      args = args.slice(1);
    }
  } else {
    arg0 = args[0];
    if (fn = arg0 && obj['cli_' + cmd + '_' + arg0]) {
      args = args.slice(1);
    } else {
      fn = obj['cli_' + cmd];
    }
  }

  if (typeof fn !== 'function') {
    return console.error('error processing command', cmd, args);
  }
  return fn.call(obj, args, opts);
}

module.exports = dispatch;
