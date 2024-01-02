import { setupFacebookAuthentication, type FacebookAuthentication } from '@/domain/use-cases'
import { makePgUserAccountRepo } from '@/main/factories/repositories'
import { makeFacebookApi, makeJwtTokenHandler } from '@/main/factories/gateways'

export const makeFacebookAuthentication = (): FacebookAuthentication => {
  return setupFacebookAuthentication(
    makeFacebookApi(),
    makePgUserAccountRepo(),
    makeJwtTokenHandler()
  )
}
