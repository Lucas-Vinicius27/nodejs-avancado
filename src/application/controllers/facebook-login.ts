import { type FacebookAuthentication } from '@/domain/feature'
import { AccessToken } from '@/domain/models'
import { badRequest, unauthorized, type HttpResponse, serverError, ok } from '@/application/helpers'
import { RequiredFieldError } from '@/application/errors'

type HttpRequest = {
  token: string | undefined | null
}

export class FacebookLgoinController {
  constructor (private readonly facebookAuthentication: FacebookAuthentication) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
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
        return ok({ accessToken: accessToken.value })
      }

      return unauthorized()
    } catch (error) {
      return serverError(error)
    }
  }
}
