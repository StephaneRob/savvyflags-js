import { SavvyFlagsAttributeTypes } from '../types'

export const evalRegex = (
  attributeValue: SavvyFlagsAttributeTypes,
  value: SavvyFlagsAttributeTypes
) => {
  const attributeValueCleaned = `${attributeValue}`
  const valueCleaned = `${value}`
  const regex = new RegExp(valueCleaned)
  return !!attributeValueCleaned.match(regex)
}
