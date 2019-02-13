import Vue, { ComponentOptions } from "vue";
import cC from "vue-class-component";
import VueRouter, { RouteRecord } from "vue-router";
import { Dictionary } from "vue-router/types/router";
import { ThisTypedComponentOptionsWithRecordProps as TP } from "vue/types/options";
import { ExtendedVue } from "vue/types/vue";
import { Skip } from "./utils";

type NotSelectable<T> = { [key in keyof T]-?: T[key] };
type NotUnsure<T> = Exclude<T, undefined>;

// tslint:disable-next-line:interface-name
interface Constructor<T> {
  new (...args: any[]): T;
}

declare global {
  /** 定义Vue组件props */
  type VueProps<T> = {
    [key in keyof T]: NotSelectable<T>[key] extends string
      ? StringConstructor
      : NotSelectable<T>[key] extends number
      ? NumberConstructor
      : NotSelectable<T>[key] extends boolean
      ? BooleanConstructor
      : NotSelectable<T>[key] extends () => any
      ? FunctionConstructor
      : Constructor<NotUnsure<T[key]>>
  };

  // tslint:disable-next-line:interface-name
  interface VueRouterDef<Q = {}, P = {}, M = undefined>
    extends RouterVue.RouterKeysDef<Q, P, M> {}
}

export function classic<T extends Vue>(
  component: Constructor<T>,
  extend?: ComponentOptions<T>
): T {
  return cC(extend || {})(component as any);
}

// tslint:disable-next-line:no-namespace
export namespace RouterVue {
  // tslint:disable-next-line:interface-name
  interface Route<Q = {}, P = {}, M = undefined> {
    path: string;
    name?: string;
    hash: string;
    query: Q & DS;
    params: P & DS;
    fullPath: string;
    matched: RouteRecord[];
    redirectedFrom?: string;
    meta: M;
  }

  type DS = Dictionary<string>;

  // tslint:disable-next-line:interface-name
  export interface Router<Q, P, M> extends Skip<Vue, { $route: any }> {
    $router: VueRouter;
    $route: Route<Q, P, M>;
  }

  export type Definitions<Q, P, M> = <Data, Methods, Computed, Props>(
    options?: TP<Vue, Data, Methods, Computed, Props>
  ) => ExtendedVue<Router<Q, P, M>, Data, Methods, Computed, Props>;

  // tslint:disable-next-line:interface-name
  export interface RouterKeysDef<Q, P, M> {
    query?: Array<keyof Q>;
    params?: Array<keyof P>;
    meta?: M;
  }

  // tslint:disable-next-line:interface-name
  export interface RouterDef<Q, P, M> {
    query?: Q;
    params?: P;
    meta?: M;
  }
}

/**
 * ## 定义一个有路由能力的组件
 *
 * @author Big Mogician
 * @template Q typeof query, default = {}
 * @template P typeof params, default = {}
 * @template M typeof meta, default = undefined
 * @returns
 */
export function RouterVue<
  Q = {},
  P = {},
  M = undefined
>(): RouterVue.Definitions<Q, P, M>;
export function RouterVue<
  Data,
  Methods,
  Computed,
  Props,
  Q = {},
  P = {},
  M = undefined
>(
  options?: TP<Vue, Data, Methods, Computed, Props>,
  $router?: RouterVue.RouterKeysDef<Q, P, M> | Array<keyof Q>
): ExtendedVue<RouterVue.Router<Q, P, M>, Data, Methods, Computed, Props>;
export function RouterVue<
  Data,
  Methods,
  Computed,
  Props,
  Q = {},
  P = {},
  M = undefined
>(
  options?: TP<Vue, Data, Methods, Computed, Props>,
  // tslint:disable-next-line:unified-signatures
  $router?: RouterVue.RouterDef<Q, P, M> | Q
): ExtendedVue<RouterVue.Router<Q, P, M>, Data, Methods, Computed, Props>;
export function RouterVue(args?: any) {
  if (args) {
    const { $router: _, ...options } = args;
    return Vue.extend(options);
  }
  return function $r(options?: any) {
    return Vue.extend(options);
  };
}

export * from "vue";
export { cC as Component, Vue };
