"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deviceTokenRepository = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class DeviceTokenRepository {
    async saveToken(userId, token, platform) {
        return prisma.deviceToken.upsert({
            where: { token },
            update: {
                userId,
                platform,
            },
            create: {
                userId,
                token,
                platform,
            },
        });
    }
    async getTokensByUser(userId) {
        const devices = await prisma.deviceToken.findMany({
            where: { userId },
        });
        return devices.map((d) => d.token);
    }
    async getAllTokens() {
        const devices = await prisma.deviceToken.findMany();
        return devices.map((d) => d.token);
    }
}
exports.deviceTokenRepository = new DeviceTokenRepository();
