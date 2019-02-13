import Vue, { ComponentOptions } from "vue";
import cC from "vue-class-component";
import VueRouter, { RouteRecord } from "vue-router";
import { Dictionary } from "vue-router/types/router";
import { ThisTypedComponentOptionsWithRecordProps as TP } from "vue/types/options";
import { ExtendedVue } from "vue/types/vue";
import { Skip } from "./utils";
type NotSelectable<T> = {
    [key in keyof T]-?: T[key];
};
type NotUnsure<T> = Exclude<T, undefined>;
interface Constructor<T> {
    new (...args: any[]): T;
}
declare global {
    /** 定义Vue组件props */
    type VueProps<T> = {
        [key in keyof T]: NotSelectable<T>[key] extends string ? StringConstructor : NotSelectable<T>[key] extends number ? NumberConstructor : NotSelectable<T>[key] extends boolean ? BooleanConstructor : NotSelectable<T>[key] extends () => any ? FunctionConstructor : Constructor<NotUnsure<T[key]>>;
    };
    interface VueRouterDef<Q = {}, P = {}, M = undefined> extends RouterVue.RouterKeysDef<Q, P, M> {
    }
}
export declare function classic<T extends Vue>(component: Constructor<T>, extend?: ComponentOptions<T>): T;
export declare namespace RouterVue {
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
    interface Router<Q, P, M> extends Skip<Vue, {
        $route: any;
    }> {
        $router: VueRouter;
        $route: Route<Q, P, M>;
    }
    type Definitions<Q, P, M> = <Data, Methods, Computed, Props>(options?: TP<Vue, Data, Methods, Computed, Props>) => ExtendedVue<Router<Q, P, M>, Data, Methods, Computed, Props>;
    interface RouterKeysDef<Q, P, M> {
        query?: Array<keyof Q>;
        params?: Array<keyof P>;
        meta?: M;
    }
    interface RouterDef<Q, P, M> {
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
export declare function RouterVue<Q = {}, P = {}, M = undefined>(): RouterVue.Definitions<Q, P, M>;
export declare function RouterVue<Data, Methods, Computed, Props, Q = {}, P = {}, M = undefined>(options?: TP<Vue, Data, Methods, Computed, Props>, $router?: RouterVue.RouterKeysDef<Q, P, M> | Array<keyof Q>): ExtendedVue<RouterVue.Router<Q, P, M>, Data, Methods, Computed, Props>;
export declare function RouterVue<Data, Methods, Computed, Props, Q = {}, P = {}, M = undefined>(options?: TP<Vue, Data, Methods, Computed, Props>, $router?: RouterVue.RouterDef<Q, P, M> | Q): ExtendedVue<RouterVue.Router<Q, P, M>, Data, Methods, Computed, Props>;
export * from "vue";
export { cC as Component, Vue };
