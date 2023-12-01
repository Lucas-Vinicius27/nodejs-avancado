import { getRepository } from 'typeorm'
import { PgUser } from '@/infra/postgres/entities'
import {
  type SaveFacebookAccountRepository,
  type LoadUserAccountRepository
} from '@/data/contracts/repos'

type LoadParams = LoadUserAccountRepository.Params
type LoadResult = LoadUserAccountRepository.Result
type SaveParams = SaveFacebookAccountRepository.Params
type SaveResult = SaveFacebookAccountRepository.Result

export class PgUserAccountRepository implements LoadUserAccountRepository, SaveFacebookAccountRepository {
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
