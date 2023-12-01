import { env } from '@/main/config/env'
import { type ConnectionOptions } from 'typeorm'

export const config: ConnectionOptions = {
  type: 'postgres',
  host: env.dbConfig.host,
  port: env.dbConfig.port,
  username: env.dbConfig.username,
  password: env.dbConfig.password,
  database: env.dbConfig.database,
  entities: ['dist/infra/postgres/entities/index.js']
}
