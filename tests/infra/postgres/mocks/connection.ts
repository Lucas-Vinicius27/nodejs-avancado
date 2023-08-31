import { DataType, newDb, type IMemoryDb } from 'pg-mem'
import { type Connection } from 'typeorm'

export const makeFakeDb = async (entities?: any[]): Promise<IMemoryDb> => {
  const db = newDb()
  db.public.registerFunction({
    name: 'current_database',
    args: [],
    returns: DataType.text,
    implementation: (x: any) => `hello world ${x}`
  })
  db.public.registerFunction({
    name: 'version',
    args: [],
    returns: DataType.text,
    implementation: (x: any) => `hello world ${x}`
  })
  const connection: Connection = await db.adapters.createTypeormConnection({
    type: 'postgres',
    entities: entities ?? ['src/infra/postgres/entities/index.ts']
  })
  await connection.synchronize()
  return db
}
