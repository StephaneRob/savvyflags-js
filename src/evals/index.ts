import { SavvyFlagsAttributeTypes, SavvyFlagsFlagConditionType } from 'src/types'
import { evalEqual } from './equal'
import { evalRegex } from './regex'
import { evalGt, evalLt, evalGtOrEqual, evalLtOrEqual } from './math'
import { evalIn, evalNotIn } from './list'
import { evalSample } from './sample'

export const evalValue = (
  type: SavvyFlagsFlagConditionType,
  attributeValue: SavvyFlagsAttributeTypes,
  value: SavvyFlagsAttributeTypes
) => {
  let match
  switch (type) {
    case 'equal':
      match = evalEqual(attributeValue, value)
      break

    case 'not_equal':
      match = !evalEqual(attributeValue, value)
      break

    case 'match_regex':
      match = evalRegex(attributeValue, value)
      break

    case 'not_match_regex':
      match = !evalRegex(attributeValue, value)
      break

    case 'lt':
      match = evalLt(attributeValue, value)
      break

    case 'lt_or_equal':
      match = evalLtOrEqual(attributeValue, value)
      break

    case 'gt':
      match = evalGt(attributeValue, value)
      break

    case 'gt_or_equal':
      match = evalGtOrEqual(attributeValue, value)
      break

    case 'in':
      match = evalIn(attributeValue, value as string | number)
      break

    case 'not_in':
      match = evalNotIn(attributeValue, value as string | number)
      break

    case 'sample':
      match = evalSample(attributeValue, value as number)
      break

    default:
      match = false
      break
  }
  return match
}
