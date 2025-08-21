import { afterAll, afterEach, beforeAll } from 'vitest'
import { EventSource as NodeEventSource } from 'eventsource'

// Polyfill EventSource for Node test environment
;(globalThis as any).EventSource = (globalThis as any).EventSource || (NodeEventSource as any)
import { setupServer } from 'msw/node'
import { HttpResponse, http } from 'msw'
import { SavvyFlagsFlags, SavvyFlagsFlagsEvaluated } from './src/types'

interface SavvyFlagsFlagsEvaluatedResponse {
  features: SavvyFlagsFlagsEvaluated
}

interface SavvyFlagsFlagsResponse {
  features: SavvyFlagsFlags
}
const flags: SavvyFlagsFlagsResponse = {
  features: {
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
  },
}

const flagsEvaluated: SavvyFlagsFlagsEvaluatedResponse = {
  features: {
    'myapp:test': 'green',
  },
}

const flagsEvaluated2: SavvyFlagsFlagsEvaluatedResponse = {
  features: {
    'myapp:test': 'red',
  },
}

export const restHandlers = [
  http.get('http://fake.com/api/features/sdk_dUJWMldTTEc5e', () => {
    return HttpResponse.json(flags)
  }),
  http.post('http://fake.com/api/features/sdk_dUJWMldTTEc5e', async ({ request }) => {
    const { email } = (await request.json()) as { email: string }
    if (email === 'stephane.robino@gmail.com') {
      return HttpResponse.json(flagsEvaluated)
    }
    return HttpResponse.json(flagsEvaluated2)
  }),
  http.get('http://fake.com/api/features/sdk_dUJWMldTTEc5e/stream', () => {
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode('hello'))
        controller.close()
      },
    })

    return new HttpResponse(stream, {
      headers: {
        'content-type': 'text/event-stream',
      },
    })
  }),
]

const server = setupServer(...restHandlers)

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

//  Close server after all tests
afterAll(() => server.close())

// Reset handlers after each test `important for test isolation`
afterEach(() => server.resetHandlers())
