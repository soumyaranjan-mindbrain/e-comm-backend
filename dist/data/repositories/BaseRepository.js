"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_client_1 = __importDefault(require("../../prisma-client"));
class BaseRepository {
    defaultLimit = 10;
    defaultOffset = 0;
    client = prisma_client_1.default;
    getClient() {
        return this.client;
    }
}
exports.default = BaseRepository;
