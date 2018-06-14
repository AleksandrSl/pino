'use strict'
const test = require('tape')
const pino = require('../browser')

test('set the level by string', ({end, same, is}) => {
  var expected = [
    {
      level: 50,
      msg: 'this is an error'
    },
    {
      level: 60,
      msg: 'this is fatal'
    }
  ]
  var instance = pino({
    browser: {
      write (actual) {
        checkLogObjects(is, same, actual, expected.shift())
      }
    }
  })

  instance.level = 'error'
  instance.info('hello world')
  instance.error('this is an error')
  instance.fatal('this is fatal')

  end()
})

test('set the level by string. init with silent', ({end, same, is}) => {
  var expected = [
    {
      level: 50,
      msg: 'this is an error'
    },
    {
      level: 60,
      msg: 'this is fatal'
    }
  ]
  var instance = pino({
    level: 'silent',
    browser: {
      write (actual) {
        checkLogObjects(is, same, actual, expected.shift())
      }
    }
  })

  instance.level = 'error'
  instance.info('hello world')
  instance.error('this is an error')
  instance.fatal('this is fatal')

  end()
})

test('set the level by string. init with silent and transmit', ({end, same, is}) => {
  var expected = [
    {
      level: 50,
      msg: 'this is an error'
    },
    {
      level: 60,
      msg: 'this is fatal'
    }
  ]
  var instance = pino({
    level: 'silent',
    browser: {
      write (actual) {
        checkLogObjects(is, same, actual, expected.shift())
      }
    },
    transmit: {
      send () {}
    }
  })

  instance.level = 'error'
  instance.info('hello world')
  instance.error('this is an error')
  instance.fatal('this is fatal')

  end()
})

test('set the level via constructor', ({end, same, is}) => {
  var expected = [
    {
      level: 50,
      msg: 'this is an error'
    },
    {
      level: 60,
      msg: 'this is fatal'
    }
  ]
  var instance = pino({
    level: 'error',
    browser: {
      write (actual) {
        checkLogObjects(is, same, actual, expected.shift())
      }
    }
  })

  instance.info('hello world')
  instance.error('this is an error')
  instance.fatal('this is fatal')

  end()
})

test('the wrong level throws', ({end, throws}) => {
  var instance = pino()
  throws(() => {
    instance.level = 'kaboom'
  })
  end()
})

test('the wrong level by number throws', ({end, throws}) => {
  var instance = pino()
  throws(() => {
    instance.levelVal = 55
  })
  end()
})

test('exposes level string mappings', ({end, is}) => {
  is(pino.levels.values.error, 50)
  end()
})

test('exposes level number mappings', ({end, is}) => {
  is(pino.levels.labels[50], 'error')
  end()
})

test('returns level integer', ({end, is}) => {
  var instance = pino({level: 'error'})
  is(instance.levelVal, 50)
  end()
})

test('silent level via constructor', ({end, fail}) => {
  var instance = pino({
    level: 'silent',
    browser: {
      write () {
        fail('no data should be logged')
      }
    }
  })

  Object.keys(pino.levels.values).forEach((level) => {
    instance[level]('hello world')
  })

  end()
})

test('silent level by string', ({end, fail}) => {
  var instance = pino({
    browser: {
      write () {
        fail('no data should be logged')
      }
    }
  })

  instance.level = 'silent'

  Object.keys(pino.levels.values).forEach((level) => {
    instance[level]('hello world')
  })

  end()
})

test('exposed levels', ({end, same}) => {
  same(Object.keys(pino.levels.values), [
    'fatal',
    'error',
    'warn',
    'info',
    'debug',
    'trace'
  ])
  end()
})

test('exposed labels', ({end, same}) => {
  same(Object.keys(pino.levels.labels), [
    '10',
    '20',
    '30',
    '40',
    '50',
    '60'
  ])
  end()
})

function checkLogObjects (is, same, actual, expected) {
  is(actual.time <= Date.now(), true, 'time is greater than Date.now()')

  var actualCopy = Object.assign({}, actual)
  var expectedCopy = Object.assign({}, expected)
  delete actualCopy.time
  delete expectedCopy.time

  same(actualCopy, expectedCopy)
}
