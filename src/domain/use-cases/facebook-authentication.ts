import { type LoadFacebookUser, type TokenGenerator } from '@/domain/contracts/gateways'
import {
  type LoadUserAccount,
  type SaveFacebookAccount
} from '@/domain/contracts/repos'
import { AuthenticationError } from '@/domain/entities/errors'
import { AccessToken, FacebookAccount } from '@/domain/entities'

type Input = { token: string }
type Output = { accessToken: string }

export type FacebookAuthentication = (params: Input) => Promise<Output>

type Setup = (
  facebook: LoadFacebookUser,
  userAccountRepo: LoadUserAccount & SaveFacebookAccount,
  token: TokenGenerator
) => FacebookAuthentication

export const setupFacebookAuthentication: Setup = (
  facebook,
  userAccountRepo,
  token
) => async params => {
  const fbData = await facebook.loadUser(params)

  if (fbData !== undefined) {
    const accountData = await userAccountRepo.load({ email: fbData.email })
    const fbAccount = new FacebookAccount(fbData, accountData)
    const { id } = await userAccountRepo.saveWithFacebook(fbAccount)
    const accessToken = await token.generate({
      key: id,
      expirationInMs: AccessToken.expirationInMs
    })

    return { accessToken }
  }

  throw new AuthenticationError()
}
