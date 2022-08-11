export default () => ({
  server: {
    ssl: process.env.SSL,
    domain: process.env.DOMAIN || 'localhost',
    port: parseInt(process.env.PORT, 10) || 3000,
    salt: parseInt(process.env.SALT_ROUND),
    secretKey: process.env.SECRET_OR_KEY,
  },
  databaseMongo: {
    host: process.env.DB_NOSQL,
  },
  databaseMaria: {
    name: process.env.DB_DATABASE_SQL,
    host: process.env.DB_HOST_SQL,
    port: Number(process.env.DB_PORT_SQL),
    username: process.env.DB_USERNAME_SQL,
    password: process.env.DB_PASSWORD_SQL,
  },
});
