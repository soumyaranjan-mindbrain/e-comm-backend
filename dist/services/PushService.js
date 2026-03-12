"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pushService = void 0;
const firebase_1 = __importDefault(require("../config/firebase"));
class PushService {
    async sendPush(tokens, title, body) {
        if (!tokens.length)
            return;
        const message = {
            notification: {
                title,
                body,
            },
            tokens,
        };
        return firebase_1.default.messaging().sendEachForMulticast(message);
    }
}
exports.pushService = new PushService();
