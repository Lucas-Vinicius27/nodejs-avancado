import { getRepository } from 'typeorm'
import { PgUser } from '@/infra/postgres/entities'
import {
  type SaveFacebookAccount,
  type LoadUserAccount
} from '@/domain/contracts/repos'

type LoadParams = LoadUserAccount.Params
type LoadResult = LoadUserAccount.Result
type SaveParams = SaveFacebookAccount.Params
type SaveResult = SaveFacebookAccount.Result

export class PgUserAccountRepository implements LoadUserAccount, SaveFacebookAccount {
  async load ({ email }: LoadParams): Promise<LoadResult> {
    const pgUserRepo = getRepository(PgUser)
    const pgUser = await pgUserRepo.findOne({ where: { email } })
    if (pgUser !== undefined && pgUser !== null) {
      return { id: pgUser.id.toString(), name: pgUser.name ?? undefined }
    }
  }

  async saveWithFacebook ({ email, facebookId, name, id }: SaveParams): Promise<SaveResult> {
    const pgUserRepo = getRepository(PgUser)
    if (id === undefined) {
      const pgUser = await pgUserRepo.save({
        email,
        name,
        facebookId
      })
      return { id: pgUser.id.toString() }
    }

    await pgUserRepo.update({ id: parseInt(id) }, {
      name,
      facebookId
    })
    return { id }
  }
}
