"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailer = void 0;
const mailtrap_mailer_1 = require("./mailtrap-mailer");
const console_log_mailer_1 = require("./console-log-mailer");
const config_1 = __importDefault(require("@/config"));
let mailer = mailtrap_mailer_1.mailer;
exports.mailer = mailer;
if (config_1.default.consoleLogEmails) {
    exports.mailer = mailer = console_log_mailer_1.mailer;
}
//# sourceMappingURL=index.js.map