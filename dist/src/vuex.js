"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var vuex_1 = __importStar(require("vuex"));
exports.Vuex = vuex_1.default;
__export(require("vuex"));
var MAPS = {
    mapState: vuex_1.mapState,
    mapGetters: vuex_1.mapGetters,
    mapMutations: vuex_1.mapMutations,
    mapActions: vuex_1.mapActions
};
/**
 * ## Namespace of Vuex's ts helpers
 *
 * @author Big Mogician
 */
// tslint:disable-next-line:no-namespace
var VUEX;
(function (VUEX) {
    function bindScope(scope) {
        return __assign({}, MAPS, { bindActions: bindActions.bind(scope), bindMutations: bindMutations.bind(scope), bindGetters: bindGetters.bind(scope), createStore: function () {
                return new vuex_1.default.Store(scope);
            },
            createComputed: function (_a) {
                var state = _a.state, getters = _a.getters;
                return __assign({}, MAPS.mapState(state), MAPS.mapGetters(getters));
            },
            createMethods: function (_a) {
                var mutations = _a.mutations, actions = _a.actions;
                return __assign({}, MAPS.mapMutations(mutations), MAPS.mapActions(actions));
            } });
    }
    function bindActions(actions) {
        return bindScope(__assign({}, this, { actions: actions }));
    }
    function bindMutations(mutations) {
        return bindScope(__assign({}, this, { mutations: mutations }));
    }
    function bindGetters(getters) {
        return bindScope(__assign({}, this, { getters: getters }));
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
    function bindState(state) {
        return bindScope({ state: state });
    }
    VUEX.bindState = bindState;
})(VUEX = exports.VUEX || (exports.VUEX = {}));
//# sourceMappingURL=vuex.js.map