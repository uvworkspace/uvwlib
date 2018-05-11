'use strict';

var yaml = require('js-yaml');

var Scanner = require('../lib/scanner');

function frontMatter(str) {
  var ret = [{}];
  var sc = Object.create(Scanner).init(str);

  var b = sc.untilLine('---');
  var s = b ? sc.getResult() : sc.source();
  ret[0].data = s.trim() ? yaml.safeLoad(s) : {};
  ret[0].texts = [];
  if (!b) return ret;

  var line = sc.nextLine();
  var name = line.slice(3).trim();
  while (sc.untilLine('---')) {
    process(ret, sc.getResult(), name);

    line = sc.nextLine();
    name = line.slice(3).trim();
  }
  process(ret, sc.remain(), name);

  return ret;
}

function process(ret, str, name) {
  if (name) {
    if (name[0] === '|') {
      var lns = str.split('\n').map(function(ln) {
        return ln.slice(2);
      });
      ret[ret.length-1].texts.push(lns.join('\n'));
    } else {
      ret.push({
        name: name,
        data: str.trim() ? yaml.safeLoad(str) : {},
        texts: []
      });
    }
  } else {
    ret[ret.length-1].texts.push(str);
  }
}

frontMatter.toText = toText;
function toText(front) {
  var lines = [];
  var rec = front[0];
  if (rec.data) lines.push(yaml.safeDump(rec.data).trim());
  genTexts(rec, lines);

  for (var i=1; i<front.length; i++) {
    rec = front[i];
    lines.push('--- ' + rec.name);
    if (rec.data) s.push(yaml.safeDump(rec.data).trim());
    genTexts(rec, lines);
  }
  return lines.join('\n');
}

function genTexts(rec, lines) {
  rec.texts && rec.texts.forEach(function(text) {
    var b = /^---/.test(text);
    lines.push(b ? '--- |' : '---');
    text.split().forEach(function(line) {
      lines.push(b ? '  ' + line : line);
    });
  });
}

frontMatter.yamlParser = yaml;

module.exports = frontMatter;
