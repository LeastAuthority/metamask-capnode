const test = require('tape')
const capnode = require('../')

test('a basic connection', (t) => {

  const server = capnode.createServer({
    foo: () => Promise.resolve('bar'),
    bam: 'baz',
  })

  const client = capnode.createClient(server)

  client.on('remote', async (remote) => {

    t.equal(remote.bam, 'baz', 'remote returned concrete value.')
    const result = await remote.foo()
    t.equal(result, 'bar', 'remote returned correctly.')
    t.end()
  })

  client.pipe(server).pipe(client)
})

test('a method in an object', (t) => {

  const server = capnode.createServer({
    foo: {
      bar: () => Promise.resolve('bam'),
      bizzam: {
        presto: () => Promise.resolve('huzzah!')
      },
    },
  })

  const client = capnode.createClient(server)

  client.on('remote', async (remote) => {

    t.equal(typeof remote.foo, 'object')
    t.equal(typeof remote.foo.bar, 'function')
    const result = await remote.foo.bar()
    t.equal(result, 'bam')
    const result2 = await remote.foo.bizzam.presto()
    t.equal(result2, 'huzzah!')
    t.end()
  })

  client.pipe(server).pipe(client)
})


/*
test('ability to return additional promise-returning functions', (t) => {
  const server = capnode.createServer({
    foo: () => Promise.resolve({
      bam: (arg) => Promise.resolve('baz' + arg)
    }),
  })

  const client = capnode.createClient(server)

  client.on('remote', async (remote) => {

    t.equal(remote.bam, 'baz', 'remote returned concrete value.')
    const result = await remote.foo()
    t.equal(typeof result, 'object', 'returned an object as expected')
    t.equal(typeof resut.bam, 'function', 'object has a function named bam')
    const result2 = await result.bam('!')
    t.equal(result2, 'baz!', 'Remote operated on nested method.')
    t.end()
  })

  client.pipe(server).pipe(client)
})
*/
