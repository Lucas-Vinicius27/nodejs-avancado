import { type TokenGenerator, type TokenValidator } from '@/domain/contracts/crypto'
import { type JwtPayload, sign, verify } from 'jsonwebtoken'

export class JwtTokenHandler implements TokenGenerator {
  constructor (private readonly secret: string) {}

  async generateToken ({ expirationInMs, key }: TokenGenerator.Params): Promise<TokenGenerator.Result> {
    const expirationInSeconds = expirationInMs / 1000
    const token = sign(
      { key },
      this.secret,
      { expiresIn: expirationInSeconds }
    )
    return token
  }

  async validateToken ({ token }: TokenValidator.Params): Promise<TokenValidator.Result> {
    const payload = verify(token, this.secret) as JwtPayload
    return payload.key
  }
}
