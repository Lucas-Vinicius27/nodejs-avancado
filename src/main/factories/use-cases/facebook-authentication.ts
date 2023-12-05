import { FacebookAuthenticationUseCase } from '@/domain/use-cases'
import { makePgUserAccountRepo } from '@/main/factories/repositories'
import { makeJwtTokenGenerator } from '@/main/factories/crypto'
import { makeFacebookApi } from '@/main/factories/apis'

export const makeFacebookAuthentication = (): FacebookAuthenticationUseCase => {
  return new FacebookAuthenticationUseCase(
    makeFacebookApi(),
    makePgUserAccountRepo(),
    makeJwtTokenGenerator()
  )
}
