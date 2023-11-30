import axios from 'axios'
import { type HttpGetClient } from '@/infra/http'

export class AxiosHttpClient implements HttpGetClient {
  async get ({ params, url }: HttpGetClient.Params): Promise<any> {
    const result = await axios.get(url, { params })
    return result.data
  }
}
