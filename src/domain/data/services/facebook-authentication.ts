import { type FacebookAuthentication } from '@/domain/feature'
import { type LoadFacebookUserApi } from '@/domain/data/contracts/apis'
import {
  type LoadUserAccountRepository,
  type CreateFacebookAccountRepository,
  type UpdateFacebookAccountRepository
} from '@/domain/data/contracts/repos'
import { AuthenticationError } from '@/domain/errors'

export class FacebookAuthenticationService {
  constructor (
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepo: LoadUserAccountRepository &
    CreateFacebookAccountRepository &
    UpdateFacebookAccountRepository
  ) {}

  async perform (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const fbData = await this.facebookApi.loadUser(params)

    if (fbData !== undefined) {
      const accountData = await this.userAccountRepo.load({ email: fbData.email })

      if (accountData !== undefined) {
        await this.userAccountRepo.updateWithFacebook({
          id: accountData.id,
          name: accountData.name ?? fbData.name,
          facebookId: fbData.facebookId
        })
      } else {
        await this.userAccountRepo.createFromFacebook(fbData)
      }
    }

    return new AuthenticationError()
  }
}
