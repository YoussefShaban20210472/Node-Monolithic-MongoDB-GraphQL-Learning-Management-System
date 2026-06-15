import { createClient, RedisClientType } from "redis";
import config from "../config/index.js";
import { RedisError } from "../error/redis.error.js";
class RedisClient {
  private client: RedisClientType;
  private isConnected = false;

  constructor() {
    this.client = createClient(config.redis);
  }

  async connect(): Promise<void> {
    try {
      if (this.isConnected) return;

      await this.client.connect();

      this.isConnected = true;

      console.log("Redis connected successfully");
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new RedisError(error.message);
      } else {
        throw new RedisError(
          "Error happens while connecting to caching server",
        );
      }
    }
  }

  async get(key: string): Promise<string | null> {
    await this.connect();
    try {
      return this.client!.get(key);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new RedisError(error.message);
      } else {
        throw new RedisError(
          "Error happens while getting value from caching server",
        );
      }
    }
  }

  async set(
    key: string,
    value: string = "true",
    expiresIn?: number,
  ): Promise<string | null> {
    await this.connect();
    try {
      return this.client!.set(key, value, {
        EX: expiresIn ?? config.redisExpiresIn,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new RedisError(error.message);
      } else {
        throw new RedisError(
          "Error happens while setting value to caching server",
        );
      }
    }
  }
  getClient(): RedisClientType {
    return this.client;
  }
}

const redis = new RedisClient();

export default redis;
