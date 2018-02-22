'use strict';

var yaml = require('js-yaml');

var Scanner = require('./scanner');

function frontMatter(str) {
  var sc = Scanner.instance(str);
  sc.skip(/\s+/);

  var s, m, prevName, ret;
  while (!sc.hasTerminated()) {
    sc.scan(/---[\t ]*([ -\w\/\.]*)[\n$]/);
    if (m = sc.getMatch()) {
      ret = process(ret, '\n', prevName);
    } else {
      s = sc.scanUntil(/\n---[\t ]*([ -\w\/\.]*)[\n$]/);
      if (m = sc.getMatch()) {
        s = s.slice(0, s.length - m.length + 1);
        ret = process(ret, s, prevName);
      } else {
        s = sc.scanUntil(/$/);
        ret = process(ret, s, prevName);
      }
    }

    prevName = m ? sc.getCapture(0).trim() : null;
  }

  if (!ret) ret = {};
  if (prevName) {
    (ret.__children || (ret.__children = [])).push({ name: prevName, data: {}});
  }
  if (ret.__contents) ret.__content = ret.__contents[0];
  return ret;
}

function process(ret, str, prevName) {
  var arr;
  if (!ret) {
    ret = str.trim() ? yaml.safeLoad(str) : {};
    if (prevName) {
      ret = {
        __children: [{
          name: prevName,
          data: ret
        }]
      };
    }
  } else {
    if (prevName) {
      arr = ret.__children || (ret.__children = []);
      arr.push({
        name: prevName,
        data: str.trim() ? yaml.safeLoad(str) : {}
      });
    } else {
      if (ret.__children) {
        arr = ret.__children[ret.__children.length-1];
        arr = arr.texts || (arr.texts = []);
      } else {
        arr = ret.__contents || (ret.__contents = []);
      }
      arr.push(str);
    }
  }
  return ret;
}

module.exports = frontMatter;
