import { AuthenticationError } from '@/domain/errors'
import { type FacebookAuthentication } from '@/domain/feature'
import { type MockProxy, mock } from 'jest-mock-extended'

class FacebookLgoinController {
  constructor (private readonly facebookAuthentication: FacebookAuthentication) {}

  async handle (httpRequest: any): Promise<HttpResponse> {
    if (
      httpRequest.token === '' ||
      httpRequest.token === null ||
      httpRequest.token === undefined
    ) {
      return {
        statusCode: 400,
        data: new Error('The filed token is required')
      }
    }

    const result = await this.facebookAuthentication.perform({ token: httpRequest.token })

    return {
      statusCode: 401,
      data: result
    }
  }
}

type HttpResponse = {
  statusCode: number
  data: any
}

describe('FacebookLgoinController', () => {
  let sut: FacebookLgoinController
  let facebookAuth: MockProxy<FacebookAuthentication>

  beforeAll(() => {
    facebookAuth = mock()
  })

  beforeEach(() => {
    sut = new FacebookLgoinController(facebookAuth)
  })

  it('should return 400 if token is empty', async () => {
    const httpResponse = await sut.handle({ token: '' })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The filed token is required')
    })
  })

  it('should return 400 if token is null', async () => {
    const httpResponse = await sut.handle({ token: null })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The filed token is required')
    })
  })

  it('should return 400 if token is undefined', async () => {
    const httpResponse = await sut.handle({ token: undefined })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The filed token is required')
    })
  })

  it('should call FacebookAuthentication with correct params', async () => {
    await sut.handle({ token: 'any_token' })

    expect(facebookAuth.perform).toHaveBeenCalledWith({ token: 'any_token' })
    expect(facebookAuth.perform).toHaveBeenCalledTimes(1)
  })

  it('should return 401 if authentication fails', async () => {
    facebookAuth.perform.mockResolvedValueOnce(new AuthenticationError())
    const httpResponse = await sut.handle({ token: 'any_token' })

    expect(httpResponse).toEqual({
      statusCode: 401,
      data: new AuthenticationError()
    })
  })
})
