import { expect, test } from 'vitest'
import { FlagEvaluator } from './FlagEvaluator'
import { SavvyFlagsFlagRule, SavvyFlagsFlags } from './types'

const buildFlags = (rules: Array<SavvyFlagsFlagRule>) => {
  return {
    'myapp:test': {
      type: 'string',
      default_value: 'red',
      rules,
    },
  }
}

test('should match first rule even if all true', () => {
  const f = buildFlags([
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
  ]) as SavvyFlagsFlags
  let flagEvaluator = new FlagEvaluator({ email: 'test@gmail.com' })
  flagEvaluator.updateFlags(f)
  expect(flagEvaluator.eval('myapp:test')).toBe('green')
})

test("should match second rule if first doesn't match", () => {
  const f = buildFlags([
    {
      value: 'green',
      condition: {
        email: {
          equal: 'stephane@hey.com',
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
  ]) as SavvyFlagsFlags
  let flagEvaluator = new FlagEvaluator({ email: 'test@gmail.com' })
  flagEvaluator.updateFlags(f)
  expect(flagEvaluator.eval('myapp:test')).toBe('yellow')
})

test('should first rule if all condition are verified', () => {
  const f = buildFlags([
    {
      value: 'green',
      condition: {
        email: {
          equal: 'stephane@hey.com',
        },
        id: {
          equal: 10,
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
  ]) as SavvyFlagsFlags
  let flagEvaluator = new FlagEvaluator({ email: 'stephane@hey.com', id: 10 }, f)
  expect(flagEvaluator.eval('myapp:test')).toBe('green')
  flagEvaluator = new FlagEvaluator({ email: 'stephane@hey.com', id: 11 }, f)
  expect(flagEvaluator.eval('myapp:test')).toBe('red')
  flagEvaluator = new FlagEvaluator({ id: 10 }, f)
  expect(flagEvaluator.eval('myapp:test')).toBe('red')
})

test('should match sample', () => {
  const f = buildFlags([
    {
      value: 'green',
      condition: {
        email: {
          sample: 10,
        },
      },
    },
  ]) as SavvyFlagsFlags
  let flagEvaluator = new FlagEvaluator({ email: 'stephane@hey.com', id: 10 }, f)
  expect(flagEvaluator.eval('myapp:test')).toBe('red')
  flagEvaluator = new FlagEvaluator({ email: 'whatever2@hey.com' }, f)
  expect(flagEvaluator.eval('myapp:test')).toBe('green')
})
