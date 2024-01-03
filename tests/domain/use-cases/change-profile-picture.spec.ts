import { mock } from 'jest-mock-extended'

type Input = { id: string, file: Buffer }
type Output = Promise<void>
type ChangeProfilePicture = (input: Input) => Output
type Setup = (fileStorage: UploadFile) => ChangeProfilePicture

export const setupChangeProfilePicture: Setup = fileStorage => async ({ file, id }) => {
  await fileStorage.upload({ file, key: id })
}

export interface UploadFile {
  upload: (input: UploadFile.Input) => Promise<void>
}

export namespace UploadFile {
  export type Input = { file: Buffer, key: string }
}

describe('ChangeProfilePicture', () => {
  it('should call UploadFile with correct input', async () => {
    const file = Buffer.from('any_buffer')
    const fileStorage = mock<UploadFile>()
    const sut = setupChangeProfilePicture(fileStorage)

    await sut({ id: 'any_id', file })

    expect(fileStorage.upload).toHaveBeenCalledWith({ file, key: 'any_id' })
    expect(fileStorage.upload).toHaveBeenCalledTimes(1)
  })
})
