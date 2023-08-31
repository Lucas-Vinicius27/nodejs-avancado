import { getRepository } from 'typeorm'
import { PgUser } from '@/infra/postgres/entities'
import {
  type SaveFacebookAccountRepository,
  type LoadUserAccountRepository
} from '@/data/contracts/repos'

export class PgUserAccountRepository implements LoadUserAccountRepository {
  async load (params: LoadUserAccountRepository.Params): Promise<LoadUserAccountRepository.Result> {
    const pgUserRepo = getRepository(PgUser)
    const pgUser = await pgUserRepo.findOne({ where: { email: params.email } })
    if (pgUser !== undefined && pgUser !== null) {
      return { id: pgUser.id.toString(), name: pgUser.name ?? undefined }
    }
    return undefined
  }

  async saveWithFacebook (params: SaveFacebookAccountRepository.Params): Promise<void> {
    const pgUserRepo = getRepository(PgUser)
    await pgUserRepo.save({
      email: params.email,
      name: params.name,
      facebookId: params.facebookId
    })
  }
}
