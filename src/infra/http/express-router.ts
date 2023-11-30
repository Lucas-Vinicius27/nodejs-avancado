import { type Response, type Request } from 'express'
import { type Controller } from '@/application/controllers'

export class ExpressRouter {
  constructor (private readonly controller: Controller) {}
  async adapt (req: Request, res: Response): Promise<void> {
    const result = await this.controller.handle({ ...req.body })
    if (result.statusCode === 200) {
      res.status(result.statusCode).json(result.data)
    } else {
      res.status(result.statusCode).json({ error: result.data.message })
    }
  }
}
