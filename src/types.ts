export type SavvyFlagsAttributeTypes = boolean | string | number | Array<string> | Array<number>

export interface SavvyFlagsClientContext {
  [key: string]: SavvyFlagsAttributeTypes
}

export type SavvyFlagsFlagValue = undefined | string | boolean | string | number

export type SavvyFlagsFlagConditionType =
  | 'equal'
  | 'not_equal'
  | 'match_regex'
  | 'not_match_regex'
  | 'gt'
  | 'gt_or_equal'
  | 'lt'
  | 'lt_or_equal'
  | 'in'
  | 'not_in'
  | 'sample'

export type SavvyFlagsFlagRule = {
  value: SavvyFlagsFlagValue
  condition: {
    [key: string]: {
      [type in SavvyFlagsFlagConditionType]?: string | number | boolean
    }
  }
}
export type SavvyFlagsFlagSettings = {
  type: 'string'
  default_value: SavvyFlagsFlagValue
  rules: Array<SavvyFlagsFlagRule>
}

export interface SavvyFlagsFlagsEvaluated {
  [key: string]: SavvyFlagsFlagValue
}

export interface SavvyFlagsFlags {
  [key: string]: SavvyFlagsFlagSettings
}
