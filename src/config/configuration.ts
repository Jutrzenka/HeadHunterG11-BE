export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    hostMongo: process.env.DATABASE_USER_MONGO,
  },
});
