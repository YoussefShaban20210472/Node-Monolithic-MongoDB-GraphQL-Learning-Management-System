import session from "express-session";
import { RedisStore } from "connect-redis";
import redis from "../cache/redis.js";
import config from "../config/index.js";

await redis.connect();
export const sessionMiddleware = session({
  store: new RedisStore({
    client: redis.getClient(), // or your internal client
  }),

  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,

  cookie: {
    httpOnly: true,
    secure: false, // true in production (HTTPS)
    maxAge: config.sessionExpiresIn,
  },
});
