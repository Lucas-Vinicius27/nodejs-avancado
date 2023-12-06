import { type LoadFacebookUserApi } from '@/domain/contracts/apis'
import {
  type LoadUserAccountRepository,
  type SaveFacebookAccountRepository
} from '@/domain/contracts/repos'
import { AuthenticationError } from '@/domain/entities/errors'
import { AccessToken, FacebookAccount } from '@/domain/entities'
import { type TokenGenerator } from '@/domain/contracts/crypto'

export type FacebookAuthentication = (params: { token: string }) => Promise<AccessToken | AuthenticationError>

type Setup = (
  facebookApi: LoadFacebookUserApi,
  userAccountRepo: LoadUserAccountRepository & SaveFacebookAccountRepository,
  crypto: TokenGenerator
) => FacebookAuthentication

export const setupFacebookAuthentication: Setup = (
  facebookApi,
  userAccountRepo,
  crypto
) => async params => {
  const fbData = await facebookApi.loadUser(params)

  if (fbData !== undefined) {
    const accountData = await userAccountRepo.load({ email: fbData.email })
    const fbAccount = new FacebookAccount(fbData, accountData)
    const { id } = await userAccountRepo.saveWithFacebook(fbAccount)
    const token = await crypto.generateToken({
      key: id,
      expirationInMs: AccessToken.expirationInMs
    })

    return new AccessToken(token)
  }

  return new AuthenticationError()
}