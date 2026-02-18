"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.send = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("@/config"));
const options = {
    host: config_1.default.mail.host,
    port: config_1.default.mail.port,
    auth: {
        user: config_1.default.mail.username,
        pass: config_1.default.mail.password,
    },
};
const transporter = nodemailer_1.default.createTransport(options);
const send = async (mailNotification) => {
    await transporter.sendMail({
        from: '"Task Manager" <notifications@taskmanager.com>',
        to: mailNotification.to,
        subject: mailNotification.subject,
        text: mailNotification.text,
        html: mailNotification.html,
    });
};
exports.send = send;
//# sourceMappingURL=MailtrapMailer.js.map