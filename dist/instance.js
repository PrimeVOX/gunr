"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInstance = void 0;
const mailgun_1 = __importDefault(require("./mailgun"));
let instance;
function getInstance(apiKey, apiDomain) {
    if (!instance)
        instance = mailgun_1.default(apiKey, apiDomain);
    return instance;
}
exports.getInstance = getInstance;
exports.default = getInstance();
//# sourceMappingURL=instance.js.map