"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
class BaseRepository {
    defaultLimit = 10;
    defaultOffset = 0;
    client;
    constructor() {
        this.client = new client_1.PrismaClient();
    }
    getClient() {
        return this.client;
    }
}
exports.default = BaseRepository;
