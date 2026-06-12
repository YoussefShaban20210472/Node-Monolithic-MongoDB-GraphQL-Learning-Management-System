export default {
  db: {
    url: process.env.MONGODB_URI!,
    dbName: process.env.MONGODB_NAME!,
  },
  redis: {
    url: process.env.REDIS_URI!,
  },
};
