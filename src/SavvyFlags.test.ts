import { expect, test } from 'vitest'
import { SavvyFlagsClient } from './SavvyFlagsClient'

const URL = 'http://fake.com/api/features/sdk_dUJWMldTTEc5e'

test('plain mode must fetch flags from url', async () => {
  const client = new SavvyFlagsClient({
    url: URL,
    context: { email: 'test@gmail.com' },
    mode: 'plain',
  })
  await client.init()
  expect(client.flags).toEqual({
    'myapp:test': {
      type: 'string',
      default_value: 'red',
      rules: [
        {
          value: 'green',
          condition: {
            email: {
              equal: 'test@gmail.com',
            },
          },
        },
        {
          value: 'yellow',
          condition: {
            email: {
              equal: 'test@gmail.com',
            },
          },
        },
      ],
    },
  })

  expect(client.getFlag('myapp:test', 'whatever')).toBe('green')
  expect(client.getFlag('myapp:test2', 'whatever')).toBe('whatever')
})

test('remote evaluated mode must fetch flags from url', async () => {
  const client = new SavvyFlagsClient({
    url: URL,
    context: { email: 'stephane.robino@gmail.com' },
    mode: 'remoteEvaluated',
  })
  await client.init()
  expect(client.flags).toEqual({
    'myapp:test': 'green',
  })
  expect(client.getFlag('myapp:test', 'whatever')).toBe('green')
  expect(client.getFlag('myapp:test2', 'whatever')).toBe('whatever')
})

test('try to update context w/ plain mode', async () => {
  const client = new SavvyFlagsClient({
    url: URL,
    context: { email: 'test@gmail.com' },
    mode: 'plain',
  })
  await client.init()
  expect(client.flags).toEqual({
    'myapp:test': {
      type: 'string',
      default_value: 'red',
      rules: [
        {
          value: 'green',
          condition: {
            email: {
              equal: 'test@gmail.com',
            },
          },
        },
        {
          value: 'yellow',
          condition: {
            email: {
              equal: 'test@gmail.com',
            },
          },
        },
      ],
    },
  })

  expect(client.getFlag('myapp:test', 'whatever')).toBe('green')
  expect(client.getFlag('myapp:test2', 'whatever')).toBe('whatever')

  await client.setContext({ email: 'john@doe.fr' })
  expect(client.getFlag('myapp:test', 'whatever')).toBe('red')
  expect(client.getFlag('myapp:test2', 'whatever')).toBe('whatever')
})

test('try to update context w/ remote evaluated mode', async () => {
  const client = new SavvyFlagsClient({
    url: URL,
    context: { email: 'stephane.robino@gmail.com' },
    mode: 'remoteEvaluated',
    streamUpdates: true,
  })
  await client.init()
  expect(client.flags).toEqual({
    'myapp:test': 'green',
  })
  expect(client.getFlag('myapp:test', 'whatever')).toBe('green')
  expect(client.getFlag('myapp:test2', 'whatever')).toBe('whatever')

  await client.setContext({ email: 'john@doe.fr' })
  expect(client.flags).toEqual({
    'myapp:test': 'red',
  })
  expect(client.getFlag('myapp:test', 'whatever')).toBe('red')
  expect(client.getFlag('myapp:test2', 'whatever')).toBe('whatever')
})
