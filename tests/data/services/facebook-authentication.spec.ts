import { mock, type MockProxy } from 'jest-mock-extended'
import { FacebookAuthenticationService } from '@/domain/data/services'
import { AuthenticationError } from '@/domain/errors'
import { type LoadFacebookUserApi } from '@/domain/data/contracts/apis'
import {
  type LoadUserAccountRepository,
  type CreateFacebookAccountRepository
} from '@/domain/data/contracts/repos'

describe('FacebookAuthenticationService', () => {
  let facebookApi: MockProxy<LoadFacebookUserApi>
  let userAccountRepo: MockProxy<LoadUserAccountRepository & CreateFacebookAccountRepository>
  let sut: FacebookAuthenticationService
  const token = 'any_token'
  const userFacebook = {
    name: 'any_fb_name',
    email: 'any_fb_email',
    facebookId: 'any_fb_id'
  }

  beforeEach(() => {
    facebookApi = mock()
    facebookApi.loadUser.mockResolvedValue(userFacebook)
    userAccountRepo = mock()
    sut = new FacebookAuthenticationService(
      facebookApi,
      userAccountRepo
    )
  })

  it('should call LoadFacebookUserApi with correct params', async () => {
    await sut.perform({ token })

    expect(facebookApi.loadUser).toHaveBeenCalledWith({ token })
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    facebookApi.loadUser.mockResolvedValueOnce(undefined)

    const authResult = await sut.perform({ token })

    expect(authResult).toEqual(new AuthenticationError())
  })

  it('should call LoadUserAccountRepo when LoadFacebookUserApi returns data', async () => {
    await sut.perform({ token })

    expect(userAccountRepo.load).toHaveBeenCalledWith({ email: userFacebook.email })
    expect(userAccountRepo.load).toHaveBeenCalledTimes(1)
  })

  it('should call CreateFacebookAccountRepo when LoadUserAccountRepo returns undefined', async () => {
    userAccountRepo.load.mockResolvedValueOnce(undefined)
    await sut.perform({ token })

    expect(userAccountRepo.createFromFacebook).toHaveBeenCalledWith(userFacebook)
    expect(userAccountRepo.createFromFacebook).toHaveBeenCalledTimes(1)
  })
})
