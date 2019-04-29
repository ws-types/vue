import {
  ValidatorReturnType,
  IActionsAuth,
  RuleGroup,
  AuthRuleNamespace,
  RuleNamespace,
  IAuthRule,
  IAsyncAuthRule,
  Result
} from "./contract";

function createError<META, CHECK extends ValidatorReturnType>(
  msg?: string | ((metadata: META, result: CHECK) => Error)
): (metadata?: META, result?: CHECK) => Error {
  if (typeof msg === "function") {
    return msg as any;
  }
  return function _error() {
    return Error(msg);
  };
}

/**
 * ## 定义一组操作权限
 *
 * @author Big Mogician
 * @export
 * @template T
 * @param {T} configs
 * @return {IActionsAuth<T>}
 */
export function defineAuths<T extends RuleGroup>(configs: T): IActionsAuth<T> {
  return {
    check<K extends keyof T>(key: K, metadata: any): any {
      const { validator, errorMsg } = configs[key];
      const result:
        | ValidatorReturnType
        | Promise<ValidatorReturnType> = validator(metadata);
      const handleError = createError(errorMsg);
      if (result instanceof Promise) {
        return result.then(r01 => {
          if (r01 === true) {
            return Promise.resolve({
              success: true
            });
          }
          if (r01 === false) {
            return Promise.resolve({
              success: false,
              error: handleError(metadata)
            });
          }
          return Promise.resolve({
            success: false,
            error: handleError(metadata, r01 as any)
          });
        });
      }
      if (result === true) {
        return {
          success: true
        };
      }
      if (result === false) {
        return {
          success: false,
          error: handleError(metadata)
        };
      }
      return {
        success: false,
        error: handleError(metadata, result as any)
      };
    }
  };
}

export function defineAuthGroup<T extends RuleNamespace>(
  configs: T
): AuthRuleNamespace<T>;
export function defineAuthGroup<T extends RuleGroup>(
  configs: T
): IActionsAuth<T>;
export function defineAuthGroup(configs: any) {
  if (configs.validator || configs.errorMsg) {
    throw new Error("invalid configs");
  }
  const namespace: { [key: string]: any } = {};
  for (const key in configs) {
    if (key) {
      const innerConfigs: any = configs[key];
      if (innerConfigs.validator || innerConfigs.errorMsg) {
        return defineAuths(configs as any);
      } else {
        namespace[key] = defineAuthGroup(innerConfigs);
      }
    }
  }
  return namespace;
}

export {
  IAuthRule as AuthRuleSync,
  IAsyncAuthRule as AuthRuleAsync,
  Result as CheckResult
};
