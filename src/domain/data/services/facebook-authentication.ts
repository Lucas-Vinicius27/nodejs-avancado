import { type FacebookAuthentication } from '@/domain/feature'
import { type LoadFacebookUserApi } from '@/domain/data/contracts/apis'
import { type LoadUserAccountRepository } from '@/domain/data/contracts/repos'
import { AuthenticationError } from '@/domain/errors'

export class FacebookAuthenticationService {
  constructor (
    private readonly loadFacebookUserApi: LoadFacebookUserApi,
    private readonly loadUserAccountRepo: LoadUserAccountRepository
  ) {}

  async perform (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const fbData = await this.loadFacebookUserApi.loadUser(params)

    if (fbData !== undefined) {
      await this.loadUserAccountRepo.load({ email: fbData.email })
    }

    return new AuthenticationError()
  }
}
