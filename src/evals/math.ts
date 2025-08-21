import { SavvyFlagsAttributeTypes } from '../types'

export const evalGt = (
  attributeValue: SavvyFlagsAttributeTypes,
  value: SavvyFlagsAttributeTypes
) => {
  return attributeValue > value
}

export const evalGtOrEqual = (
  attributeValue: SavvyFlagsAttributeTypes,
  value: SavvyFlagsAttributeTypes
) => {
  return attributeValue >= value
}

export const evalLt = (
  attributeValue: SavvyFlagsAttributeTypes,
  value: SavvyFlagsAttributeTypes
) => {
  return attributeValue < value
}

export const evalLtOrEqual = (
  attributeValue: SavvyFlagsAttributeTypes,
  value: SavvyFlagsAttributeTypes
) => {
  return attributeValue <= value
}
