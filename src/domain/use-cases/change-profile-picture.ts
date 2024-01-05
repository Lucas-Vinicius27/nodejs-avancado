import { type UUIDGenerator, type UploadFile } from '@/domain/contracts/gateways'
import { type SaveUserPicture } from '@/domain/contracts/repos'

type Input = { id: string, file?: Buffer }
export type ChangeProfilePicture = (input: Input) => Promise<void>
type Setup = (fileStorage: UploadFile, crypto: UUIDGenerator, userProfileRepo: SaveUserPicture) => ChangeProfilePicture

export const setupChangeProfilePicture: Setup = (fileStorage, crypto, userProfileRepo) => async ({ file, id }) => {
  if (file !== undefined) {
    const pictureUrl = await fileStorage.upload({ file, key: crypto.uuid({ key: id }) })
    await userProfileRepo.savePicture({ pictureUrl })
  }
}
