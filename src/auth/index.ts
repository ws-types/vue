import {
  RuleNamespace,
  RuleGroup,
  IAuthRule,
  IAsyncAuthRule,
  StringToObject
} from "./contract";
import { defineAuthGroup, defineAuths } from "./core";

class AuthRuleCreator<T extends RuleGroup = {}> {
  private readonly configs: T = {} as any;

  public addRule<
    RK extends string | number,
    RT extends IAuthRule | IAsyncAuthRule
  >(
    namespace: RK,
    configs: RT
  ): AuthRuleCreator<T & StringToObject<RK, IAuthRule | IAsyncAuthRule>>;
  public addRule(namespace: string, configs: any) {
    this.configs[namespace] = configs;
    return this;
  }

  public complete() {
    return defineAuths(this.configs);
  }
}

class AuthGroupCreator<T extends RuleNamespace = {}> {
  private readonly group: T = {} as any;

  public addRuleGroup<RK extends string | number, RT extends RuleGroup>(
    namespace: RK,
    builder: (rules: AuthRuleCreator<{}>) => AuthRuleCreator<RT>
  ): AuthGroupCreator<T & RuleNamespace<StringToObject<RK, RT>>>;
  public addRuleGroup(
    namespace: string,
    builder: (rules: AuthRuleCreator<any>) => AuthRuleCreator<any>
  ) {
    this.group[namespace] = <any>builder(new AuthRuleCreator()).complete();
    return this;
  }

  public complete() {
    return defineAuthGroup(this.group);
  }
}

export function createAuthGroup() {
  return new AuthGroupCreator();
}
