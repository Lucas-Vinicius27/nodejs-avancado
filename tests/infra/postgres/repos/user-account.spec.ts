import { DataType, newDb } from 'pg-mem'
import { Entity, PrimaryGeneratedColumn, Column, getRepository } from 'typeorm'
import { type LoadUserAccountRepository } from '@/data/contracts/repos'

export class PgUserAccountRepository implements LoadUserAccountRepository {
  async load (params: LoadUserAccountRepository.Params): Promise<LoadUserAccountRepository.Result> {
    const pgUserRepo = getRepository(PgUser)
    const pgUser = await pgUserRepo.findOne({ where: { email: params.email } })
    if (pgUser !== undefined && pgUser !== null) {
      return { id: pgUser.id.toString(), name: pgUser.name ?? undefined }
    }
    return undefined
  }
}

@Entity({ name: 'usuarios' })
export class PgUser {
  @PrimaryGeneratedColumn()
    id!: number

  @Column({ name: 'nome', nullable: true })
    name?: string

  @Column()
    email!: string

  @Column({ name: 'id_facebook', nullable: true })
    facebookId?: string
}

describe('PgUserAccountRepository', () => {
  describe('load', () => {
    it('should return an account if email exists', async () => {
      const db = newDb()
      db.public.registerFunction({
        name: 'current_database',
        args: [],
        returns: DataType.text,
        implementation: (x) => `hello world ${x}`
      })
      db.public.registerFunction({
        name: 'version',
        args: [],
        returns: DataType.text,
        implementation: (x) => `hello world ${x}`
      })
      const connection = await db.adapters.createTypeormConnection({
        type: 'postgres',
        entities: [PgUser]
      })
      await connection.synchronize()
      const pgUserRepo = getRepository(PgUser)
      await pgUserRepo.save({ email: 'existing_email' })
      const sut = new PgUserAccountRepository()

      const account = await sut.load({ email: 'existing_email' })

      expect(account).toEqual({ id: '1' })
      await connection.close()
    })

    it('should return undefined if email does not exists', async () => {
      const db = newDb()
      db.public.registerFunction({
        name: 'current_database',
        args: [],
        returns: DataType.text,
        implementation: (x) => `hello world ${x}`
      })
      db.public.registerFunction({
        name: 'version',
        args: [],
        returns: DataType.text,
        implementation: (x) => `hello world ${x}`
      })
      const connection = await db.adapters.createTypeormConnection({
        type: 'postgres',
        entities: [PgUser]
      })
      await connection.synchronize()
      const sut = new PgUserAccountRepository()

      const account = await sut.load({ email: 'new_email' })

      expect(account).toBeUndefined()
      await connection.close()
    })
  })
})
