import { FacebookAuthenticationService } from '@/domain/services'
import { makePgUserAccountRepo } from '@/main/factories/repositories'
import { makeJwtTokenGenerator } from '@/main/factories/crypto'
import { makeFacebookApi } from '@/main/factories/apis'

export const makeFacebookAuthenticationService = (): FacebookAuthenticationService => {
  return new FacebookAuthenticationService(
    makeFacebookApi(),
    makePgUserAccountRepo(),
    makeJwtTokenGenerator()
  )
}
