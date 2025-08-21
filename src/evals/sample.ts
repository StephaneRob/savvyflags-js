import murmurHash3 from 'murmurhash3js'
import { SavvyFlagsAttributeTypes } from 'src/types'

export const evalSample = (attributeValue: SavvyFlagsAttributeTypes, value: number) => {
  const normalizedAttributeValue = murmurHash3.x86.hash32(attributeValue, 0) % 100
  return normalizedAttributeValue < value
}
