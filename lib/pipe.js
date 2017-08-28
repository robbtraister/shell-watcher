var childProcess = require('child_process')

var shared = require('./shared')

var debug = console.log
try {
  debug = require('debug')('watcher:pipe')
} catch (e) {}

var pipe = module.exports = function pipe (options) {
  options = shared.defaults(options)
  var handler = options.handler || shared.invalidater(options.targets)

  var watch = childProcess.spawn(`${__dirname}/../watch.sh`, options.targets, {
    env: {
      // NOTIFY: 'echo',
      EXTS: options.exts,
      SLEEP: options.sleep
    }
  })

  watch.stdout.on('data', (data) => {
    handler(shared.parse(data.toString()))
  })

  debug(`Listening for cache reload`)
}

module.exports = pipe
