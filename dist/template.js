"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const handlebars_1 = __importDefault(require("handlebars"));
const path_1 = require("path");
const utils_1 = require("./utils");
const configure_1 = __importDefault(require("./configure"));
function initTemplates() {
    const loadedConfig = configure_1.default();
    const { rootConfig, templatesMap, CWD } = loadedConfig;
    /**
     * Loads a template by namespace.
     *
     * @param ns the namespace of the template to load.
     */
    function load(ns) {
        return __awaiter(this, void 0, void 0, function* () {
            const templateConfig = yield utils_1.promise(utils_1.readConfig(path_1.join(templatesMap[ns].path, 'config.json'), rootConfig));
            if (templateConfig.err)
                throw templateConfig.err;
            const config = templateConfig.data;
            const { err, data: html } = yield utils_1.promise(utils_1.readHtml(path_1.join(templatesMap[ns].path, 'html.hbs')));
            if (err)
                throw err;
            const assetsMap = templatesMap[ns].assets;
            let inline = [];
            let attachments = [];
            if (config.inline)
                inline = config.inline.map(k => {
                    const val = assetsMap[k];
                    if (!val)
                        throw new Error(`Failed to resolve inline asset for key ${k}.`);
                    // return absolute path.
                    return path_1.join(CWD, val);
                });
            if (config.attachments)
                attachments = config.attachments.map(k => {
                    const val = assetsMap[k];
                    if (!val)
                        throw new Error(`Failed to resolve attachment for key ${k}.`);
                    // return absolute path.
                    return path_1.join(CWD, val);
                });
            const { templatesDir } = config, clean = __rest(config, ["templatesDir"]);
            // Map to key value, properties may be in form of key object with nested "value" key.
            clean.properties = utils_1.toKeyValue(clean.properties, 'value');
            const loaded = Object.assign(Object.assign({}, clean), { html });
            loaded.inline = inline;
            loaded.attachments = attachments;
            return loaded;
        });
    }
    /**
     * Renders a template using html and context data.
     *
     * @param html the html to be rendered.
     * @param data the data passed to compiled template
     */
    function render(html, data) {
        const compiled = handlebars_1.default.compile(html);
        return compiled(data);
    }
    return {
        config: loadedConfig,
        load,
        render
    };
}
exports.default = initTemplates;
//# sourceMappingURL=template.js.map