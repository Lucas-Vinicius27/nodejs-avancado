import { mock, type MockProxy } from 'jest-mock-extended'
import { FacebookAuthenticationService } from '@/domain/data/services'
import { AuthenticationError } from '@/domain/errors'
import { type LoadFacebookUserApi } from '@/domain/data/contracts/apis'
import {
  type LoadUserAccountRepository,
  type SaveFacebookAccountRepository
} from '@/domain/data/contracts/repos'

describe('FacebookAuthenticationService', () => {
  let facebookApi: MockProxy<LoadFacebookUserApi>
  let userAccountRepo: MockProxy<
  LoadUserAccountRepository &
  SaveFacebookAccountRepository
  >
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
    userAccountRepo.load.mockResolvedValue(undefined)
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

  it('should create account with facebook data', async () => {
    await sut.perform({ token })

    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith(userFacebook)
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1)
  })

  it('should not update account name', async () => {
    userAccountRepo.load.mockResolvedValueOnce({
      id: 'any_id',
      name: 'any_name'
    })
    await sut.perform({ token })

    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith({
      id: 'any_id',
      name: 'any_name',
      email: userFacebook.email,
      facebookId: userFacebook.facebookId
    })
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1)
  })

  it('should update account name', async () => {
    userAccountRepo.load.mockResolvedValueOnce({
      id: 'any_id'
    })
    await sut.perform({ token })

    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith({
      id: 'any_id',
      name: userFacebook.name,
      email: userFacebook.email,
      facebookId: userFacebook.facebookId
    })
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1)
  })
})