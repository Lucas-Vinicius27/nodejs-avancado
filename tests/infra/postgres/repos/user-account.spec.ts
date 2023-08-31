import { type IMemoryDb, type IBackup } from 'pg-mem'
import { getRepository, type Repository, getConnection } from 'typeorm'
import { PgUser } from '@/infra/postgres/entities'
import { PgUserAccountRepository } from '@/infra/postgres/repos'
import { makeFakeDb } from '@/tests/infra/postgres/mocks'

describe('PgUserAccountRepository', () => {
  let sut: PgUserAccountRepository
  let db: IMemoryDb
  let pgUserRepo: Repository<PgUser>
  let backup: IBackup

  beforeAll(async () => {
    db = await makeFakeDb([PgUser])
    backup = db.backup()
    pgUserRepo = getRepository(PgUser)
  })

  beforeEach(() => {
    backup.restore()
    sut = new PgUserAccountRepository()
  })

  afterAll(async () => {
    await getConnection().close()
  })

  describe('load', () => {
    it('should return an account if email exists', async () => {
      await pgUserRepo.save({ email: 'any_email' })

      const account = await sut.load({ email: 'any_email' })

      expect(account).toEqual({ id: '1' })
    })

    it('should return undefined if email does not exists', async () => {
      const account = await sut.load({ email: 'any_email' })

      expect(account).toBeUndefined()
    })
  })

  describe('saveWithFacebook', () => {
    it('should create an account if id is undefined', async () => {
      await sut.saveWithFacebook({
        email: 'any_email',
        facebookId: 'any_id',
        name: 'any_fb_name'
      })
      const pgUser = await pgUserRepo.findOne({ where: { email: 'any_email' } })

      expect(pgUser?.id).toBe(1)
    })
  })
})
