var child_process = require('child_process');

var express = require('express');
var bodyParser = require('body-parser');

var shared = require('./shared');

var debug = console.log;
try {
  debug = require('debug')('reload:http');
} catch(e) {}


var http = module.exports = function http(options) {
  options = shared.defaults(options);

  var cache = express();

  cache.post('/',
    // shell doesn't care, just return immediately
    (req, res, next) => {
      res.send();
      next();
    },
    bodyParser.text(),
    (req, res, next) => {
      shared.invalidate(req.body, options);
    }
  );

  var port = options.port || 25378;
  cache.listen(port, () => {
    child_process.spawn(`${__dirname}/../watch.sh`, options.targets, {
      env: {
        NOTIFY: `curl -X POST -H Content-Type:text/plain localhost:${port} --data-binary`,
        EXTS: options.exts || 'js',
        SLEEP: options.sleep || 1
      }
    });

    debug(`Listening for cache reload on port: ${port}`);
  });
};


module.exports = http;
