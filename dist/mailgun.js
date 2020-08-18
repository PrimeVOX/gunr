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
const mailgun_js_1 = __importDefault(require("mailgun-js"));
const template_1 = __importDefault(require("./template"));
const utils_1 = require("./utils");
const utils_2 = require("./utils");
const API_KEY = process.env.MAILGUN_API_KEY;
const API_DOMAIN = process.env.MAILGUN_API_DOMAIN;
const template = template_1.default();
function initMailgun(apiKey, apiDomain) {
    let config = (apiKey || {});
    if (typeof apiKey === 'string') {
        config = {
            apiKey,
            apiDomain
        };
    }
    // If not defined try to get api key, url, domain
    // from loaded ENV variables.
    config.apiKey = config.apiKey || API_KEY;
    config.apiDomain = config.apiDomain || API_DOMAIN;
    const configKeys = Object.keys(config);
    const requiredKeys = ['apiKey', 'apiDomain'];
    requiredKeys.forEach(k => {
        if (!configKeys.includes(k))
            throw new Error(`Mailgun requires key "${k}" but was not found.`);
    });
    const mailgun = mailgun_js_1.default({ apiKey: config.apiKey, domain: config.apiDomain });
    /**
     * Gets a Mailgun list.
     *
     * @param name the name of the list to get.
     */
    function list(name) {
        return mailgun.lists(`${name}@${config.apiDomain}`);
    }
    /**
     * Adds an attachment to the mail payload.
     *
     * @param payload the payload to add the attchment to.
     * @param attachment the attachment to be added.
     * @param asInline whether to add to attachment or inline property.
     */
    function addAttachment(payload, attachment, asInline = false) {
        if (asInline)
            payload.inline = [...utils_1.ensureArray(payload.inline), ...utils_1.ensureArray(attachment)];
        else
            payload.attachment = [...utils_1.ensureArray(payload.attachment), ...utils_1.ensureArray(attachment)];
        return payload;
    }
    /**
     * Adds inline attachment data such as an image.
     *
     * @param payload the payload to add the attchment to.
     * @param inline the inline value to be added.
     */
    function addInline(payload, inline) {
        return addAttachment(payload, inline, true);
    }
    /**
     * Sends a message using mailgun.
     *
     * @param payload the data payload to be sent.
     * @param cb the callback on completed.
     */
    function send(payload, cb) {
        return mailgun.messages().send(payload, cb);
    }
    /**
     * Sends message after loading/rendering template.
     *
     * @param ns the namespace of the template.
     * @param payload the send data payload.
     * @param templateData the template context data to be rendered.
     * @param cb the callback on completed.
     */
    function sendWithTemplate(ns, payload, templateData, cb) {
        return __awaiter(this, void 0, void 0, function* () {
            const { err, data } = yield utils_2.promise(template.load(ns));
            if (err)
                throw err;
            data.sendData = data.sendData || {};
            // Allow template data to be passed with payload for convenience.
            const { templateData: altTemplateData } = payload, clean = __rest(payload, ["templateData"]);
            templateData = Object.assign(Object.assign({}, altTemplateData), templateData);
            payload = clean;
            // Merge in default "sendData" from template config defined in config.json.
            payload = Object.assign(Object.assign({}, data.sendData), payload);
            // Add in inline assets and attachments.
            payload = addInline(payload, data.inline);
            payload = addAttachment(payload, data.attachments);
            // check if config.json "properties" key should be rendered.
            if (data.renderProps) {
                const str = JSON.stringify(data.properties);
                data.properties = JSON.parse(template.render(str, templateData));
            }
            // All properties rendered and merged.
            templateData = Object.assign(Object.assign({}, data.properties), templateData);
            payload.html = template.render(data.html, templateData);
            if (payload.text)
                payload.text = template.render(payload.text, templateData);
            return send(payload, cb);
        });
    }
    function payloadToBatch(payload, recipients, extend) {
        if (!Array.isArray(recipients) && typeof recipients === 'object') {
            extend = recipients;
            recipients = undefined;
        }
        recipients = recipients || utils_1.ensureArray(payload.to);
        extend = extend || {};
        // Mailgun requires no more than
        // 1000 recipients at a time.
        const chunks = utils_1.chunkify(recipients);
        return chunks.reduce((a, c) => {
            const clone = Object.assign({}, payload);
            clone['recipient-variables'] = c.reduce((a, c) => {
                const ext = extend[c] || {};
                a[c] = Object.assign(Object.assign({}, ext), { uid: utils_1.generateUID() });
                return a;
            }, {});
            clone.to = c;
            a = [...a, clone];
            return a;
        }, []);
    }
    return {
        template,
        addAttachment,
        addInline,
        payloadToBatch,
        list,
        send,
        sendWithTemplate,
        mailgun
    };
}
exports.default = initMailgun;
//# sourceMappingURL=mailgun.js.map