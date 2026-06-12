export default {
  jwtExpiresIn: "15m",
  redisExpiresIn: 15 * 60,
  sessionExpiresIn: 1000 * 60 * 60 * 24 * 7,
  sessionSecret: process.env.SESSION_SECRET!,
  port: Number(process.env.PORT!),
};
