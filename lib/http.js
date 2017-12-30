'use strict'

const childProcess = require('child_process')

const shared = require('./shared')

let debug = console.log
try {
  debug = require('debug')('watcher:http')
} catch (e) {}

function http (options) {
  const express = require('express')
  const bodyParser = require('body-parser')

  options = shared.defaults(options)
  const handler = options.handler || shared.invalidater(options.targets)
  const onchange = options.onchange

  const cache = express()

  cache.post('/',
    // shell doesn't care, just return immediately
    (req, res, next) => {
      res.send()
      next()
    },
    bodyParser.text(),
    (req, res, next) => {
      const data = shared.parse(req.body)
      handler(data)
      onchange && onchange(data)
    }
  )

  const port = options.port || 25378
  cache.listen(port, () => {
    childProcess.spawn(`${__dirname}/../watch.sh`, options.targets, {
      env: {
        NOTIFY: `curl -X POST -H Content-Type:text/plain localhost:${port} --data-binary`,
        EXTS: options.exts,
        SLEEP: options.sleep
      }
    })

    debug(`Listening for cache reload on port: ${port}`)
  })
}

module.exports = http
