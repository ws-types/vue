import Vuex, { ActionContext, Store } from "vuex";
export * from "vuex";
type GetterOptions<S, G extends any = {}> = {
    [key in keyof G]: (state: S, getters: G) => G[key];
};
type MutationsWrapper<S, M extends any = {}> = {
    [key in keyof M]: (state: S, payload: M[key]) => void;
};
interface ICommitExtend<M extends any> {
    <K extends keyof M>(key: K extends keyof M ? K : never, payload: M[K]): ReturnType<M[K]>;
}
interface IDispatchExtend<A extends any> {
    <K extends keyof A>(key: K extends keyof A ? K : never, payload: A[K] extends (p: infer P) => any ? P : never): A[K] extends (...args: any[]) => infer R ? R : never;
}
type StoreActionsHeck<T extends any, G, M, A> = {
    [key in keyof T]: key extends "getters" ? G : key extends "commit" ? ICommitExtend<M> : key extends "dispatch" ? IDispatchExtend<A> : T[key];
};
type ActionsWrapper<S, G = any, M = any, A extends any = {}> = {
    [key in keyof A]: A[key] extends (data: infer P) => infer R ? (state: StoreActionsHeck<ActionContext<S, S>, G, M, A>, payload: P) => R : never;
};
type MapPart<T, SOURCE> = {
    [key in Extract<keyof SOURCE, T>]: SOURCE[key];
};
type MapComputed<T> = {
    readonly [key in keyof T]: () => T[key];
};
type MapMutations<T extends any> = {
    [key in keyof T]: T[key] extends void ? () => void : (payload: T[key]) => void;
};
type MapActions<T extends any> = {
    [key in keyof T]: T[key];
};
type IncludeComputed<T, SOURCE> = MapComputed<MapPart<T, SOURCE>>;
type IncludeMutations<T, SOURCE> = MapMutations<MapPart<T, SOURCE>>;
type IncludeActions<T, SOURCE> = MapActions<MapPart<T, SOURCE>>;
interface IVuexStoreAdditions<M, A> {
    mutations?: M;
    actions?: A;
}
interface VuexStore<S, G, M = {}, A = {}> extends Store<S> {
    state: S;
    getters: G;
    "@hidden"?: IVuexStoreAdditions<M, A>;
}
/**
 * ## Namespace of Vuex's ts helpers
 *
 * @author Big Mogician
 */
export declare namespace VUEX {
    type ComputedMapFunction<SOG> = <T extends keyof SOG>(keys: T[]) => IncludeComputed<T, SOG>;
    type ComputedMapCreator<STATE, GETTERS> = <TS extends keyof STATE, TG extends keyof GETTERS>(options: {
        state: TS[];
        getters: TG[];
    }) => IncludeComputed<TS, STATE> & IncludeComputed<TG, GETTERS>;
    type MutationsMapFunction<MUTATIONS> = <T extends keyof MUTATIONS>(mutationsKeys: T[]) => IncludeMutations<T, MUTATIONS>;
    type ActionsMapFunction<ACTIONS> = <T extends keyof ACTIONS>(actionsKeys: T[]) => IncludeActions<T, ACTIONS>;
    type MethodsMapCreator<MUTATIONS, ACTIONS> = <TM extends keyof MUTATIONS, TA extends keyof ACTIONS>(options: {
        mutations: TM[];
        actions: TA[];
    }) => IncludeMutations<TM, MUTATIONS> & IncludeActions<TA, ACTIONS>;
    interface IVuexStateHelper<STATE, IG = {}, IM = {}, IA = {}> {
        /**
         * ## Reference of Vuex.mapState with type boudle
         *
         * @author Big Mogician
         * @template T extends keyof STATE
         * @param {T[]} stateKeys
         * @returns {IncludeComputed<T, STATE>}
         * @memberof IVuexStateHelper
         */
        mapState: ComputedMapFunction<STATE>;
        /**
         * ## Reference of Vuex.mapGetters with type boudle
         *
         * @author Big Mogician
         * @template T extends keyof GETTERS(IG)
         * @param {T[]} gettersKeys
         * @returns {IncludeComputed<T, IG>}
         * @memberof IVuexStateHelper
         */
        mapGetters: ComputedMapFunction<IG>;
        /**
         * ## Reference of Vuex.mapMutations with type boudle
         *
         * @author Big Mogician
         * @template T extends MUTATIONS(IM)
         * @param {T[]} mutationsKeys
         * @returns {IncludeMutations<T, IM>}
         * @memberof IVuexStateHelper
         */
        mapMutations: MutationsMapFunction<IM>;
        /**
         * ## Reference of Vuex.mapActions with type boudle
         *
         * @author Big Mogician
         * @template T extends ACTIONS(IA)
         * @param {T[]} actionsKeys
         * @returns {IncludeActions<T, IA>}
         * @memberof IVuexStateHelper
         */
        mapActions: ActionsMapFunction<IA>;
        /**
         * ## Transform Vuex.state and Vues.getters into computed object
         *
         * @author Big Mogician
         * @template TS extends keyof STATE
         * @template TG extends keyof GETTERS
         * @param {{
         *     state: TS[];
         *     getters: TG[];
         *     }} options
         * @returns {(IncludeComputed<TS, STATE> & IncludeComputed<TG, IG>)}
         * @memberof IVuexStateHelper
         */
        createComputed: ComputedMapCreator<STATE, IG>;
        /**
         * ## Transform Vuex.mutations and Vues.actions into methods object
         *
         * @author Big Mogician
         * @template TM extends MUTATIONS
         * @template TA extends ACTIONS
         * @param {{
         *     mutations: TM[];
         *     actions: TA[];
         *     }} options
         * @returns {(IncludeMutations<TM, IM> & IncludeActions<TA, IA>)}
         * @memberof IVuexStateHelper
         */
        createMethods: MethodsMapCreator<IM, IA>;
        /**
         * ## Bind getters' type into store
         *
         * @author Big Mogician
         * @template G GETTERS
         * @param {GetterOptions<STATE, G>} getters
         * @returns {(IVuexStateHelper<STATE, G & IG, {} & IM, {} & IA>)}
         * @memberof IVuexStateHelper
         */
        bindGetters<G>(getters: GetterOptions<STATE, G>): IVuexStateHelper<STATE, G & IG, {} & IM, {} & IA>;
        /**
         * ## Bind mutations' type into store
         *
         * @author Big Mogician
         * @template M MUTATIONS
         * @param {MutationsWrapper<STATE, M>} mutations
         * @returns {(IVuexStateHelper<STATE, {} & IG, M & IM, {} & IA>)}
         * @memberof IVuexStateHelper
         */
        bindMutations<M>(mutations: MutationsWrapper<STATE, M>): IVuexStateHelper<STATE, {} & IG, M & IM, {} & IA>;
        /**
         * ## Bind actions' type into store
         *
         * @author Big Mogician
         * @template A ACTIONS
         * @param {ActionsWrapper<STATE, IG, IM, A>} actions
         * @returns {(IVuexStateHelper<STATE, {} & IG, {} & IM, A & IA>)}
         * @memberof IVuexStateHelper
         */
        bindActions<A>(actions: ActionsWrapper<STATE, IG, IM, A>): IVuexStateHelper<STATE, {} & IG, {} & IM, A & IA>;
        /**
         * ## Generate Vue.Store<S, ...> finally.
         *
         * @author Big Mogician
         * @returns {VuexStore<STATE, IG, IM, IA>}
         * @memberof IVuexStateHelper
         */
        createStore(): VuexStore<STATE, IG, IM, IA>;
    }
    /**
     * ## Bind State's type into Vuex.store
     *
     * @author Big Mogician
     * @export
     * @template S STATE
     * @param {S} state
     * @return {IVuexStateHelper<S>}
     */
    function bindState<S>(state: S): IVuexStateHelper<S>;
}
export { Vuex };
