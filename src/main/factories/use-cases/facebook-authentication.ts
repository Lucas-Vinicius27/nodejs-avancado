import { setupFacebookAuthentication, type FacebookAuthentication } from '@/domain/use-cases'
import { makePgUserAccountRepo } from '@/main/factories/repositories'
import { makeJwtTokenHandler } from '@/main/factories/crypto'
import { makeFacebookApi } from '@/main/factories/apis'

export const makeFacebookAuthentication = (): FacebookAuthentication => {
  return setupFacebookAuthentication(
    makeFacebookApi(),
    makePgUserAccountRepo(),
    makeJwtTokenHandler()
  )
}
