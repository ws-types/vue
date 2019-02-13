import Vuex, {
  ActionContext,
  mapActions as ma,
  mapGetters as mg,
  mapMutations as mm,
  mapState as ms,
  Store
} from "vuex";

export * from "vuex";

type GetterOptions<S, G extends any = {}> = {
  [key in keyof G]: (state: S, getters: G) => G[key]
};

type MutationsWrapper<S, M extends any = {}> = {
  [key in keyof M]: (state: S, payload: M[key]) => void
};

interface ICommitExtend<M extends any> {
  <K extends keyof M>(
    key: K extends keyof M ? K : never,
    payload: M[K]
  ): ReturnType<M[K]>;
}

interface IDispatchExtend<A extends any> {
  <K extends keyof A>(
    key: K extends keyof A ? K : never,
    payload: A[K] extends (p: infer P) => any ? P : never
  ): A[K] extends (...args: any[]) => infer R ? R : never;
}

type StoreActionsHeck<T extends any, G, M, A> = {
  [key in keyof T]: key extends "getters"
    ? G
    : key extends "commit"
    ? ICommitExtend<M>
    : key extends "dispatch"
    ? IDispatchExtend<A>
    : T[key]
};

type ActionsWrapper<S, G = any, M = any, A extends any = {}> = {
  [key in keyof A]: A[key] extends (data: infer P) => infer R
    ? (state: StoreActionsHeck<ActionContext<S, S>, G, M, A>, payload: P) => R
    : never
};

type MapPart<T, SOURCE> = { [key in Extract<keyof SOURCE, T>]: SOURCE[key] };
type MapComputed<T> = { readonly [key in keyof T]: () => T[key] };
type MapMutations<T extends any> = {
  [key in keyof T]: T[key] extends void ? () => void : (payload: T[key]) => void
};
type MapActions<T extends any> = { [key in keyof T]: T[key] };
type IncludeComputed<T, SOURCE> = MapComputed<MapPart<T, SOURCE>>;
type IncludeMutations<T, SOURCE> = MapMutations<MapPart<T, SOURCE>>;
type IncludeActions<T, SOURCE> = MapActions<MapPart<T, SOURCE>>;

interface IVuexStoreAdditions<M, A> {
  mutations?: M;
  actions?: A;
}

// tslint:disable-next-line:interface-name
interface VuexStore<S, G, M = {}, A = {}> extends Store<S> {
  state: S;
  getters: G;
  "@hidden"?: IVuexStoreAdditions<M, A>;
}

const MAPS = {
  mapState: ms,
  mapGetters: mg,
  mapMutations: mm,
  mapActions: ma
};

/**
 * ## Namespace of Vuex's ts helpers
 *
 * @author Big Mogician
 */
// tslint:disable-next-line:no-namespace
export namespace VUEX {
  export type ComputedMapFunction<SOG> = <T extends keyof SOG>(
    keys: T[]
  ) => IncludeComputed<T, SOG>;

  export type ComputedMapCreator<STATE, GETTERS> = <
    TS extends keyof STATE,
    TG extends keyof GETTERS
  >(options: {
    state: TS[];
    getters: TG[];
  }) => IncludeComputed<TS, STATE> & IncludeComputed<TG, GETTERS>;

  export type MutationsMapFunction<MUTATIONS> = <T extends keyof MUTATIONS>(
    mutationsKeys: T[]
  ) => IncludeMutations<T, MUTATIONS>;

  export type ActionsMapFunction<ACTIONS> = <T extends keyof ACTIONS>(
    actionsKeys: T[]
  ) => IncludeActions<T, ACTIONS>;

  export type MethodsMapCreator<MUTATIONS, ACTIONS> = <
    TM extends keyof MUTATIONS,
    TA extends keyof ACTIONS
  >(options: {
    mutations: TM[];
    actions: TA[];
  }) => IncludeMutations<TM, MUTATIONS> & IncludeActions<TA, ACTIONS>;

  export interface IVuexStateHelper<STATE, IG = {}, IM = {}, IA = {}> {
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
    bindGetters<G>(
      getters: GetterOptions<STATE, G>
    ): IVuexStateHelper<STATE, G & IG, {} & IM, {} & IA>;
    /**
     * ## Bind mutations' type into store
     *
     * @author Big Mogician
     * @template M MUTATIONS
     * @param {MutationsWrapper<STATE, M>} mutations
     * @returns {(IVuexStateHelper<STATE, {} & IG, M & IM, {} & IA>)}
     * @memberof IVuexStateHelper
     */
    bindMutations<M>(
      mutations: MutationsWrapper<STATE, M>
    ): IVuexStateHelper<STATE, {} & IG, M & IM, {} & IA>;
    /**
     * ## Bind actions' type into store
     *
     * @author Big Mogician
     * @template A ACTIONS
     * @param {ActionsWrapper<STATE, IG, IM, A>} actions
     * @returns {(IVuexStateHelper<STATE, {} & IG, {} & IM, A & IA>)}
     * @memberof IVuexStateHelper
     */
    bindActions<A>(
      actions: ActionsWrapper<STATE, IG, IM, A>
    ): IVuexStateHelper<STATE, {} & IG, {} & IM, A & IA>;
    /**
     * ## Generate Vue.Store<S, ...> finally.
     *
     * @author Big Mogician
     * @returns {VuexStore<STATE, IG, IM, IA>}
     * @memberof IVuexStateHelper
     */
    createStore(): VuexStore<STATE, IG, IM, IA>;
  }

  interface IThis {
    state?: any;
    getters?: any;
    mutations?: any;
    actions?: any;
  }

  function bindScope(scope: IThis) {
    return {
      ...MAPS,
      bindActions: bindActions.bind(scope),
      bindMutations: bindMutations.bind(scope),
      bindGetters: bindGetters.bind(scope),
      createStore<S, G, M, A>(): VuexStore<S, G, M, A> {
        return new Vuex.Store(scope);
      },
      createComputed({
        state,
        getters
      }: {
        state: string[];
        getters: string[];
      }) {
        return {
          ...MAPS.mapState(state),
          ...MAPS.mapGetters(getters)
        };
      },
      createMethods({
        mutations,
        actions
      }: {
        mutations: string[];
        actions: string[];
      }) {
        return {
          ...MAPS.mapMutations(mutations),
          ...MAPS.mapActions(actions)
        };
      }
    };
  }

  function bindActions<S, G, M, A>(
    this: IThis,
    actions: A
  ): IVuexStateHelper<S, G, M, A> {
    return bindScope({ ...this, actions }) as any;
  }

  function bindMutations<S, G, M>(
    this: IThis,
    mutations: M
  ): IVuexStateHelper<S, G, M> {
    return bindScope({ ...this, mutations }) as any;
  }

  function bindGetters<S, G>(this: IThis, getters: G): IVuexStateHelper<S, G> {
    return bindScope({ ...this, getters }) as any;
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
  export function bindState<S>(state: S): IVuexStateHelper<S> {
    return bindScope({ state }) as any;
  }
}

export { Vuex };
