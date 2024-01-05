import { type MockProxy, mock } from 'jest-mock-extended'

type Input = { id: string, file: Buffer }
type Output = Promise<void>
export type ChangeProfilePicture = (input: Input) => Output
type Setup = (fileStorage: UploadFile, crypto: UUIDGenerator) => ChangeProfilePicture

export const setupChangeProfilePicture: Setup = (fileStorage, crypto) => async ({ file, id }) => {
  await fileStorage.upload({ file, key: crypto.uuid({ key: id }) })
}

export interface UploadFile {
  upload: (input: UploadFile.Input) => Promise<void>
}

export namespace UploadFile {
  export type Input = { file: Buffer, key: string }
}

export interface UUIDGenerator {
  uuid: (input: UUIDGenerator.Input) => UUIDGenerator.Output
}

export namespace UUIDGenerator {
  export type Input = { key: string }
  export type Output = string
}

describe('ChangeProfilePicture', () => {
  let uuid: string
  let file: Buffer
  let fileStorage: MockProxy<UploadFile>
  let crypto: MockProxy<UUIDGenerator>
  let sut: ChangeProfilePicture

  beforeAll(() => {
    uuid = 'any_unique_id'
    file = Buffer.from('any_buffer')
    fileStorage = mock()
    crypto = mock()
    crypto.uuid.mockReturnValue(uuid)
  })

  beforeEach(() => {
    sut = setupChangeProfilePicture(fileStorage, crypto)
  })

  it('should call UploadFile with correct input', async () => {
    await sut({ id: 'any_id', file })

    expect(fileStorage.upload).toHaveBeenCalledWith({ file, key: uuid })
    expect(fileStorage.upload).toHaveBeenCalledTimes(1)
  })
})
