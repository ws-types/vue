"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = __importDefault(require("vue"));
exports.Vue = vue_1.default;
var vue_class_component_1 = __importDefault(require("vue-class-component"));
exports.Component = vue_class_component_1.default;
function classic(component, extend) {
    return vue_class_component_1.default(extend || {})(component);
}
exports.classic = classic;
function RouterVue(args) {
    if (args) {
        var _ = args.$router, options = __rest(args, ["$router"]);
        return vue_1.default.extend(options);
    }
    return function $r(options) {
        return vue_1.default.extend(options);
    };
}
exports.RouterVue = RouterVue;
__export(require("vue"));
//# sourceMappingURL=vue.js.map