import { SavvyFlagsAttributeTypes } from '../types'

export const evalIn = (attributeValue: SavvyFlagsAttributeTypes, value: string | number) => {
  if (Array.isArray(value)) {
    return value.includes(attributeValue)
  }
  return false
}

export const evalNotIn = (attributeValue: SavvyFlagsAttributeTypes, value: string | number) => {
  if (Array.isArray(value)) {
    return !value.includes(attributeValue)
  }
  return false
}
