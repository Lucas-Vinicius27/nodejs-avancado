import { type RequestHandler } from 'express'
import { type Controller } from '@/application/controllers'

export const adaptExpressRoute = (controller: Controller): RequestHandler => {
  /* eslint @typescript-eslint/no-misused-promises: 0 */
  return async (req, res) => {
    const result = await controller.handle({ ...req.body })
    if (result.statusCode === 200) {
      res.status(result.statusCode).json(result.data)
    } else {
      res.status(result.statusCode).json({ error: result.data.message })
    }
  }
}
