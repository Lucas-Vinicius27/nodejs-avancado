import { type HttpResponse } from '@/application/helpers'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { type Response, type Request, type RequestHandler, type NextFunction } from 'express'
import { type MockProxy, mock } from 'jest-mock-extended'

type Adapter = (middleware: Middleware) => RequestHandler

export const adaptExpressMiddleware: Adapter = middleware => async (req, res, next) => {
  await middleware.handle({ ...req.headers })
}

export interface Middleware {
  handle: (httpRequest: any) => Promise<HttpResponse>
}

describe('ExpressMiddleware', () => {
  let req: Request
  let res: Response
  let next: NextFunction
  let middleware: MockProxy<Middleware>
  let sut: RequestHandler

  beforeAll(() => {
    req = getMockReq({ headers: { any: 'any' } })
    res = getMockRes().res
    next = getMockRes().next
    middleware = mock()
  })

  beforeEach(() => {
    sut = adaptExpressMiddleware(middleware)
  })

  it('should call handle with correct request', async () => {
    /* eslint @typescript-eslint/await-thenable: 0 */
    /* eslint @typescript-eslint/no-confusing-void-expression: 0 */
    await sut(req, res, next)

    expect(middleware.handle).toHaveBeenCalledWith({ any: 'any' })
    expect(middleware.handle).toHaveBeenCalledTimes(1)
  })

  it('should call handle with empty request', async () => {
    const req = getMockReq()

    await sut(req, res, next)

    expect(middleware.handle).toHaveBeenCalledWith({})
    expect(middleware.handle).toHaveBeenCalledTimes(1)
  })
})
