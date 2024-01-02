import { type Express, Router } from 'express'
import { readdirSync } from 'fs'
import { join } from 'path'
/* eslint @typescript-eslint/no-floating-promises: 0 */
export const setupRoutes = (app: Express): void => {
  const router = Router()
  router.get('/', (req, res) => { res.send({ data: 'API is running!' }) })
  readdirSync(join(__dirname, '../routes'))
    .filter(file => !file.endsWith('.map'))
    .map(async file => {
      (await import(`../routes/${file}`)).default(router)
    })
  app.use('/api', router)
}
