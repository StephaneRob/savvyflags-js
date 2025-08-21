import { SavvyFlagsAttributeTypes } from '../types'

export const evalEqual = (
  attributeValue: SavvyFlagsAttributeTypes,
  value: SavvyFlagsAttributeTypes
) => {
  return attributeValue == value
}
