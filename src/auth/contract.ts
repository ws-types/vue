export type StructMap<K, V extends any> = { [key in keyof K]: V };

export type ValidatorReturnType = boolean | string | Error;

export type Result =
  | { success: false; error: Error }
  | { success: true; error?: Error };

export type ErrorMsg<
  META = any,
  CHECK extends ValidatorReturnType = ValidatorReturnType
> = string | ((metadata: META, result: CHECK) => Error);

export type RuleGroup<GROUP extends object = any> = {
  [key in keyof GROUP]: IAuthRule | IAsyncAuthRule
};

export type StringToObject<T extends string | number, V = any> = {
  [key in T]: V
};

export type RuleNamespace<
  NAMESPACE extends { [prop: string]: object } = any
> = {
  [key in keyof NAMESPACE]: StructMap<NAMESPACE[key], RuleGroup<NAMESPACE[key]>>
};

export type PromiseRuleResult<R, T extends RuleGroup> = {
  [key in keyof T]: T[key] extends IAsyncAuthRule ? Promise<R> : R
};

export type AuthRuleGroup<INNER extends { [key: string]: RuleGroup } = any> = {
  [key in keyof INNER]: IActionsAuth<INNER[key]>
};

export type AuthRuleNamespace<NAMESPACE extends RuleNamespace = any> = {
  [key in keyof NAMESPACE]: AuthRuleGroup<NAMESPACE[key]>
};

/**
 * 同步规则
 *
 * @author Big Mogician
 * @interface IAuthRule
 * @template META
 * @template CHECK
 */
export interface IAuthRule<
  META = any,
  CHECK extends ValidatorReturnType = ValidatorReturnType
> {
  errorMsg?: ErrorMsg<META, CHECK>;
  validator(metadata: META): CHECK;
}

/**
 * 异步规则
 *
 * @author Big Mogician
 * @interface IAsyncAuthRule
 * @template META
 * @template CHECK
 */
export interface IAsyncAuthRule<
  META = any,
  CHECK extends ValidatorReturnType = ValidatorReturnType
> {
  errorMsg?: ErrorMsg<META, CHECK>;
  validator(metadata: META): Promise<CHECK>;
}

export interface IActionsAuth<T extends RuleGroup> {
  check<K extends keyof T>(
    key: K,
    metadata?: T[K] extends IAuthRule<infer META> | IAsyncAuthRule<infer META>
      ? META
      : {}
  ): PromiseRuleResult<Result, T>[K];
}
