import { type FacebookAuthentication } from '@/domain/feature'
import { type LoadFacebookUserApi } from '@/domain/data/contracts/apis'
import {
  type LoadUserAccountRepository,
  type SaveFacebookAccountRepository
} from '@/domain/data/contracts/repos'
import { AuthenticationError } from '@/domain/errors'

export class FacebookAuthenticationService {
  constructor (
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepo: LoadUserAccountRepository &
    SaveFacebookAccountRepository
  ) {}

  async perform (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const fbData = await this.facebookApi.loadUser(params)

    if (fbData !== undefined) {
      const accountData = await this.userAccountRepo.load({ email: fbData.email })

      await this.userAccountRepo.saveWithFacebook({
        id: accountData?.id,
        email: fbData.email,
        name: accountData?.name ?? fbData.name,
        facebookId: fbData.facebookId
      })
    }

    return new AuthenticationError()
  }
}
