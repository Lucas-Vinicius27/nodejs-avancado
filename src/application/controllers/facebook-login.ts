import { type FacebookAuthentication } from '@/domain/feature'
import { AccessToken } from '@/domain/models'
import { badRequest, unauthorized, type HttpResponse, serverError } from '@/application/helpers'
import { RequiredFieldError } from '@/application/errors'

export class FacebookLgoinController {
  constructor (private readonly facebookAuthentication: FacebookAuthentication) {}

  async handle (httpRequest: any): Promise<HttpResponse> {
    try {
      if (
        httpRequest.token === '' ||
        httpRequest.token === null ||
        httpRequest.token === undefined
      ) {
        return badRequest(new RequiredFieldError('token'))
      }

      const accessToken = await this.facebookAuthentication.perform({ token: httpRequest.token })

      if (accessToken instanceof AccessToken) {
        return {
          statusCode: 200,
          data: { accessToken: accessToken.value }
        }
      }

      return unauthorized()
    } catch (error) {
      return serverError(error)
    }
  }
}
