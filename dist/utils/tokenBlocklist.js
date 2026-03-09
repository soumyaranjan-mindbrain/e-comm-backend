"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blockToken = blockToken;
exports.isTokenBlocked = isTokenBlocked;
const redis_1 = require("redis");
const BLOCKLIST_PREFIX = "jwt:blocklist:";
let redisClient = null;
let redisConnectPromise = null;
async function getRedisClient() {
    if (redisClient?.isOpen) {
        return redisClient;
    }
    if (redisConnectPromise) {
        return redisConnectPromise;
    }
    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl) {
        throw new Error("REDIS_URL is required for token blocklist");
    }
    const client = (0, redis_1.createClient)({ url: redisUrl });
    client.on("error", (error) => {
        // Keep runtime visibility for infra issues while preserving endpoint contracts.
        console.error("[TokenBlocklist] Redis error:", error);
    });
    redisConnectPromise = client.connect().then(() => {
        redisClient = client;
        return client;
    });
    return redisConnectPromise;
}
function getRedisKey(token) {
    return `${BLOCKLIST_PREFIX}${token}`;
}
async function blockToken(token, ttlMs = 15 * 60 * 1000) {
    const client = await getRedisClient();
    await client.set(getRedisKey(token), "1", {
        PX: ttlMs,
    });
}
async function isTokenBlocked(token) {
    const client = await getRedisClient();
    const exists = await client.exists(getRedisKey(token));
    return exists === 1;
}
