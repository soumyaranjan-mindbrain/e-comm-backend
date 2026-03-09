import { createClient } from "redis";

const BLOCKLIST_PREFIX = "jwt:blocklist:";
let redisClient: ReturnType<typeof createClient> | null = null;
let redisConnectPromise: Promise<ReturnType<typeof createClient>> | null = null;

async function getRedisClient(): Promise<ReturnType<typeof createClient>> {
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

  const client = createClient({ url: redisUrl });
  client.on("error", (error: unknown) => {
    // Keep runtime visibility for infra issues while preserving endpoint contracts.
    console.error("[TokenBlocklist] Redis error:", error);
  });

  redisConnectPromise = client.connect().then(() => {
    redisClient = client;
    return client;
  });

  return redisConnectPromise;
}

function getRedisKey(token: string): string {
  return `${BLOCKLIST_PREFIX}${token}`;
}

export async function blockToken(
  token: string,
  ttlMs = 15 * 60 * 1000,
): Promise<void> {
  const client = await getRedisClient();
  await client.set(getRedisKey(token), "1", {
    PX: ttlMs,
  });
}

export async function isTokenBlocked(token: string): Promise<boolean> {
  const client = await getRedisClient();
  const exists = await client.exists(getRedisKey(token));
  return exists === 1;
}
