var child_process = require('child_process');

var shared = require('./shared');

var debug = console.log;
try {
  debug = require('debug')('watcher:http');
} catch(e) {}


var http = module.exports = function http(options) {
  var express = require('express');
  var bodyParser = require('body-parser');

  options = shared.defaults(options);
  var handler = options.handler || shared.invalidater(options.targets);

  var cache = express();

  cache.post('/',
    // shell doesn't care, just return immediately
    (req, res, next) => {
      res.send();
      next();
    },
    bodyParser.text(),
    (req, res, next) => {
      handler(shared.parse(req.body));
    }
  );

  var port = options.port || 25378;
  cache.listen(port, () => {
    child_process.spawn(`${__dirname}/../watch.sh`, options.targets, {
      env: {
        NOTIFY: `curl -X POST -H Content-Type:text/plain localhost:${port} --data-binary`,
        EXTS: options.exts,
        SLEEP: options.sleep
      }
    });

    debug(`Listening for cache reload on port: ${port}`);
  });
};


module.exports = http;
