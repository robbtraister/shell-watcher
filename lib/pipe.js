'use strict'

const childProcess = require('child_process')

const shared = require('./shared')

let debug = console.log
try {
  debug = require('debug')('watcher:pipe')
} catch (e) {}

function pipe (options) {
  options = shared.defaults(options)
  const handler = options.handler || shared.invalidater(options.targets)

  const watch = childProcess.spawn(`${__dirname}/../watch.sh`, options.targets, {
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
