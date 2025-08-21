import { FlagEvaluator } from './FlagEvaluator'
import type { SavvyFlagsClientContext, SavvyFlagsFlagValue } from './types'

type Mode = 'plain' | 'remoteEvaluated'

type WsConfig = {
  protocol: string
  clientKey: string
} | null

type SavvyFlagsClientOptions = {
  url: string
  context: SavvyFlagsClientContext
  mode: Mode
  streamUpdates?: boolean
}

class SavvyFlagsClient {
  public url!: string
  private streamUpdates: boolean
  public context: SavvyFlagsClientContext
  public mode: Mode
  public flags: any
  public flagEvaluator: FlagEvaluator

  private _renderer: null | (() => void)

  constructor({ url, context, mode = 'plain', streamUpdates = true }: SavvyFlagsClientOptions) {
    this.streamUpdates = streamUpdates
    this.url = url
    this.context = context
    this.mode = mode
    this.flagEvaluator = new FlagEvaluator(context)
    this.flags = {}
    this._renderer = null
  }

  setRenderer(renderer: null | (() => void)) {
    this._renderer = renderer
  }

  _render() {
    if (this._renderer) this._renderer()
  }

  async _fetchFlags() {
    const response = await fetch(this.url, {
      method: this.mode === 'plain' ? 'get' : 'post',
      body: this.mode === 'plain' ? null : JSON.stringify(this.context),
      headers: {
        'content-type': 'application/json',
      },
    })
    if (response.status == 200) {
      const { features: flags } = await response.json()
      this.flags = flags
      this.flagEvaluator.updateFlags(this.flags)
      this._render()
    } else {
      console.warn(`Failed to fetch flags from ${this.url}: get ${response.status}`)
    }
  }

  _streamUpdates() {
    const eventSource = new EventSource(`${this.url}/stream`)
    eventSource.onmessage = () => {
      this._fetchFlags()
    }
  }

  async init() {
    try {
      await this._fetchFlags()
      if (this.streamUpdates) {
        this._streamUpdates()
      }
    } catch (e) {
      console.log(e)
      console.error(`Error while fetching flags from ${this.url}`)
    }
  }

  async setContext(context: SavvyFlagsClientContext) {
    this.context = context
    this.flagEvaluator.setContext(context)
    if (this.mode === 'remoteEvaluated') {
      await this.init()
    }
    this._render()
  }

  getContext() {
    return this.context
  }

  getFlag(key: string, defaultValue?: SavvyFlagsFlagValue) {
    const value = this.mode === 'plain' ? this.evalFlag(key) : this.flags[key]
    return value || defaultValue
  }

  evalFlag(key: string) {
    return this.flagEvaluator.eval(key)
  }
}

export { SavvyFlagsClient }
