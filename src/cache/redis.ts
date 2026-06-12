import { createClient, RedisClientType } from "redis";
import config from "../config/index.js";

class RedisClient {
  private client: RedisClientType;
  private isConnected = false;

  constructor() {
    this.client = createClient(config.redis);
  }

  async connect(): Promise<void> {
    if (this.isConnected) return;

    await this.client.connect();

    this.isConnected = true;

    console.log("Redis connected successfully");
  }

  async get(key: string): Promise<string | null> {
    await this.connect();

    return this.client!.get(key);
  }

  async set(
    key: string,
    value: string = "true",
    expiresIn?: number,
  ): Promise<string | null> {
    await this.connect();

    return this.client!.set(key, value, {
      EX: expiresIn ?? config.redisExpiresIn,
    });
  }
  getClient(): RedisClientType {
    return this.client;
  }
}

const redis = new RedisClient();

export default redis;
