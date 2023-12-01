export const env = {
  facebookApi: {
    clientId: String(process.env.FB_CLIENT_ID) ?? '123456',
    clientSecret: String(process.env.FB_CLIENT_SECRET) ?? '123456'
  },
  port: Number(process.env.PORT) ?? 8080,
  jwtSecret: String(process.env.JWT_SECRET) ?? 'dad656',
  dbConfig: {
    type: String(process.env.DB_TYPE) ?? 'postgres',
    host: String(process.env.DB_HOST) ?? 'motty.db.elephantsql.com',
    port: Number(process.env.DB_PORT) ?? 5432,
    username: String(process.env.DB_USERNAME) ?? 'test',
    password: String(process.env.DB_PASSWORD) ?? 'test1234',
    database: String(process.env.DB_NAME_DATABASE) ?? 'testDb'
  }
}
