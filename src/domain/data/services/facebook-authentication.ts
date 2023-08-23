import { type FacebookAuthentication } from '@/domain/feature'
import { type LoadFacebookUserApi } from '@/domain/data/contracts/apis'
import {
  type LoadUserAccountRepository,
  type CreateFacebookAccountRepository
} from '@/domain/data/contracts/repos'
import { AuthenticationError } from '@/domain/errors'

export class FacebookAuthenticationService {
  constructor (
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepo: LoadUserAccountRepository & CreateFacebookAccountRepository
  ) {}

  async perform (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const fbData = await this.facebookApi.loadUser(params)

    if (fbData !== undefined) {
      await this.userAccountRepo.load({ email: fbData.email })
      await this.userAccountRepo.createFromFacebook(fbData)
    }

    return new AuthenticationError()
  }
}
