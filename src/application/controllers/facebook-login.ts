import { type FacebookAuthentication } from '@/domain/feature'
import { AccessToken } from '@/domain/models'
import { unauthorized, type HttpResponse, ok } from '@/application/helpers'
import { ValidationBuilder as Builder, type Validator } from '@/application/validation'
import { Controller } from './controller'

type HttpRequest = {
  token: string
}

type Model = Error | {
  accessToken: string
}

export class FacebookLoginController extends Controller {
  constructor (private readonly facebookAuthentication: FacebookAuthentication) {
    super()
  }

  async perform ({ token }: HttpRequest): Promise<HttpResponse<Model>> {
    const accessToken = await this.facebookAuthentication.perform({ token })

    if (accessToken instanceof AccessToken) return ok({ accessToken: accessToken.value })

    return unauthorized()
  }

  override buildValidators ({ token }: HttpRequest): Validator[] {
    return [
      ...Builder.of({ value: token, fieldName: 'token' }).required().build()
    ]
  }
}
