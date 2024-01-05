import { type UUIDGenerator, type UploadFile } from '@/domain/contracts/gateways'

type Input = { id: string, file?: Buffer }
export type ChangeProfilePicture = (input: Input) => Promise<void>
type Setup = (fileStorage: UploadFile, crypto: UUIDGenerator) => ChangeProfilePicture

export const setupChangeProfilePicture: Setup = (fileStorage, crypto) => async ({ file, id }) => {
  if (file !== undefined) await fileStorage.upload({ file, key: crypto.uuid({ key: id }) })
}