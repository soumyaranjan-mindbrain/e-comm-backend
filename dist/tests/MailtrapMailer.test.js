"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("@/config"));
const mailtrapMailer = __importStar(require("@/services/mailer/mailtrap-mailer/MailtrapMailer"));
const sendMailMock = jest.fn().mockResolvedValue("Email sent successfully");
jest.mock("nodemailer", () => ({
    createTransport: jest.fn(() => ({
        sendMail: sendMailMock,
    })),
}));
describe("MailtrapMailer", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    test("should send an email with correct parameters", async () => {
        const mailNotification = {
            to: "recipient@example.com",
            subject: "Test Subject",
            text: "Test email content",
            html: "<p>Test email content</p>",
        };
        await mailtrapMailer.send(mailNotification);
        expect(nodemailer_1.default.createTransport).toHaveBeenCalledWith({
            host: config_1.default.mail.host,
            port: config_1.default.mail.port,
            auth: {
                user: config_1.default.mail.username,
                pass: config_1.default.mail.password,
            },
        });
        expect(sendMailMock).toHaveBeenCalledTimes(1);
        expect(sendMailMock).toHaveBeenCalledWith({
            from: '"Task Manager" <notifications@taskmanager.com>',
            to: "recipient@example.com",
            subject: "Test Subject",
            text: "Test email content",
            html: "<p>Test email content</p>",
        });
    });
});
