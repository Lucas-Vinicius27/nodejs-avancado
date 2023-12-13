import { JwtTokenHandler } from '@/infra/crypto'
import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken')

describe('JwtTokenHandler', () => {
  let sut: JwtTokenHandler
  let fakeJwt: jest.Mocked<typeof jwt>
  let secret: string

  beforeAll(() => {
    fakeJwt = jwt as jest.Mocked<typeof jwt>
    secret = 'any_secret'
  })

  beforeEach(() => {
    sut = new JwtTokenHandler(secret)
  })

  describe('generateToken', () => {
    beforeAll(() => {
      fakeJwt.sign.mockImplementation(() => 'any_token')
    })

    it('should call sign with correct params', async () => {
      await sut.generateToken({ key: 'any_key', expirationInMs: 1000 })

      expect(fakeJwt.sign).toHaveBeenCalledWith(
        { key: 'any_key' },
        secret,
        { expiresIn: 1 }
      )
      expect(fakeJwt.sign).toHaveBeenCalledTimes(1)
    })

    it('should return a token', async () => {
      const token = await sut.generateToken({ key: 'any_key', expirationInMs: 1000 })

      expect(token).toBe('any_token')
    })

    it('should rethrow if sign throws', async () => {
      fakeJwt.sign.mockImplementationOnce(() => { throw new Error('token_error') })

      const promise = sut.generateToken({ key: 'any_key', expirationInMs: 1000 })

      await expect(promise).rejects.toThrow(new Error('token_error'))
    })
  })
})
