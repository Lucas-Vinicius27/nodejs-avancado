import './config/modules-alias'
import 'reflect-metadata'
import 'dotenv/config'
import { app } from '@/main/config/app'
import { env } from '@/main/config/env'
import { createConnection } from 'typeorm'
import { config } from '@/infra/postgres/helpers'

createConnection(config)
  .then(() => app.listen(env.port, () => { console.log(`Server is running at http://localhost:${env.port}`) }))
  .catch(console.error)
