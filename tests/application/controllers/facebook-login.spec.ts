import { type MockProxy, mock } from 'jest-mock-extended'
import { AuthenticationError } from '@/domain/errors'
import { type FacebookAuthentication } from '@/domain/feature'
import { AccessToken } from '@/domain/models'
import { FacebookLgoinController } from '@/application/controllers'
import { ServerError, UnauthorizedError } from '@/application/errors'

describe('FacebookLgoinController', () => {
  let sut: FacebookLgoinController
  let facebookAuth: MockProxy<FacebookAuthentication>
  let token: string

  beforeAll(() => {
    token = 'any_token'
    facebookAuth = mock()
    facebookAuth.perform.mockResolvedValue(new AccessToken('any_value'))
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
    const httpResponse = await sut.handle({ token: null as any })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The filed token is required')
    })
  })

  it('should return 400 if token is undefined', async () => {
    const httpResponse = await sut.handle({ token: undefined as any })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The filed token is required')
    })
  })

  it('should call FacebookAuthentication with correct params', async () => {
    await sut.handle({ token })

    expect(facebookAuth.perform).toHaveBeenCalledWith({ token })
    expect(facebookAuth.perform).toHaveBeenCalledTimes(1)
  })

  it('should return 401 if authentication fails', async () => {
    facebookAuth.perform.mockResolvedValueOnce(new AuthenticationError())
    const httpResponse = await sut.handle({ token })

    expect(httpResponse).toEqual({
      statusCode: 401,
      data: new UnauthorizedError()
    })
  })

  it('should return 200 if authentication succeeds', async () => {
    const httpResponse = await sut.handle({ token })

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: { accessToken: 'any_value' }
    })
  })

  it('should return 500 if authentication throws', async () => {
    const error = new Error('infra_error')
    facebookAuth.perform.mockRejectedValueOnce(error)
    const httpResponse = await sut.handle({ token })

    expect(httpResponse).toEqual({
      statusCode: 500,
      data: new ServerError(error)
    })
  })
})
