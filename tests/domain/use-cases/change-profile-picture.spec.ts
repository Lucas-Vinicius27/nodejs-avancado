import { type MockProxy, mock } from 'jest-mock-extended'
import { type UUIDGenerator, type UploadFile } from '@/domain/contracts/gateways'
import { type SaveUserPicture } from '@/domain/contracts/repos'
import { type ChangeProfilePicture, setupChangeProfilePicture } from '@/domain/use-cases'

describe('ChangeProfilePicture', () => {
  let uuid: string
  let file: Buffer
  let fileStorage: MockProxy<UploadFile>
  let crypto: MockProxy<UUIDGenerator>
  let userProfileRepo: MockProxy<SaveUserPicture>
  let sut: ChangeProfilePicture

  beforeAll(() => {
    uuid = 'any_unique_id'
    file = Buffer.from('any_buffer')
    fileStorage = mock()
    fileStorage.upload.mockResolvedValue('any_url')
    crypto = mock()
    crypto.uuid.mockReturnValue(uuid)
    userProfileRepo = mock()
  })

  beforeEach(() => {
    sut = setupChangeProfilePicture(fileStorage, crypto, userProfileRepo)
  })

  it('should call UploadFile with correct input', async () => {
    await sut({ id: 'any_id', file })

    expect(fileStorage.upload).toHaveBeenCalledWith({ file, key: uuid })
    expect(fileStorage.upload).toHaveBeenCalledTimes(1)
  })

  it('should not call UploadFile when file is undefined', async () => {
    await sut({ id: 'any_id', file: undefined })

    expect(fileStorage.upload).not.toHaveBeenCalled()
  })

  it('should call SaveUserPicture with correct input', async () => {
    await sut({ id: 'any_id', file })

    expect(userProfileRepo.savePicture).toHaveBeenCalledWith({ pictureUrl: 'any_url' })
    expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1)
  })

  it('should call SaveUserPicture with correct input when file is undefined', async () => {
    await sut({ id: 'any_id', file: undefined })

    expect(userProfileRepo.savePicture).toHaveBeenCalledWith({ pictureUrl: undefined })
    expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1)
  })
})
