import { evalValue } from './evals'
import {
  SavvyFlagsClientContext,
  SavvyFlagsFlagRule,
  SavvyFlagsFlags,
  SavvyFlagsFlagsEvaluated,
  SavvyFlagsFlagConditionType,
  SavvyFlagsFlagValue,
  SavvyFlagsAttributeTypes,
} from './types'

class FlagEvaluator {
  context: SavvyFlagsClientContext
  flags?: SavvyFlagsFlags
  private _cache: SavvyFlagsFlagsEvaluated

  constructor(context: SavvyFlagsClientContext, flags: SavvyFlagsFlags = {}) {
    this.context = context
    this.flags = flags
    this._cache = {}
  }

  updateFlags(flags: SavvyFlagsFlags) {
    this.flags = flags
    this._cache = {}
  }

  setContext(context: SavvyFlagsClientContext) {
    this.context = context
    this._cache = {}
  }

  eval(key: string) {
    const cachedFlag = this._cache[key]
    if (cachedFlag) {
      return cachedFlag
    }

    let value: SavvyFlagsFlagValue
    if (this.flags && key in this.flags) {
      const flagSettings = this.flags[key]
      value = flagSettings.default_value

      for (const rule of flagSettings.rules) {
        if (this.evalRule(rule)) {
          value = rule.value
          break
        }
      }
    }

    if (value) this._cache[key] = value
    return value
  }

  evalRule(rule: SavvyFlagsFlagRule) {
    let match = true
    Object.entries(rule.condition).forEach(([attribute, test]) => {
      const attributeValue = this.context[attribute] || ''
      const [[type, value]] = Object.entries(test) as [[SavvyFlagsFlagConditionType, string]]
      match = match && evalValue(type, attributeValue, value)
    })

    return match
  }

  evalEqual(attributeValue: SavvyFlagsAttributeTypes, value: SavvyFlagsAttributeTypes) {
    return attributeValue == value
  }

  evalNotEqual(attributeValue: SavvyFlagsAttributeTypes, value: SavvyFlagsAttributeTypes) {
    return !this.evalEqual(attributeValue, value)
  }
}

export { FlagEvaluator }
