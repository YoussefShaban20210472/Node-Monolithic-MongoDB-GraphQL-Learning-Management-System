export default {
  db: {
    url: process.env.MONGODB_URL!,
    dbName: process.env.MONGODB_NAME!,
  },
  redis: {
    url: process.env.REDIS_URL!,
  },
};
