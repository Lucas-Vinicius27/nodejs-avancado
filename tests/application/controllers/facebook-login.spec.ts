class FacebookLgoinController {
  async handle (httpRequest: any): Promise<HttpResponse> {
    return {
      statusCode: 400,
      data: new Error('The filed token is required')
    }
  }
}

type HttpResponse = {
  statusCode: number
  data: any
}

describe('FacebookLgoinController', () => {
  it('should return 400 if token is empty', async () => {
    const sut = new FacebookLgoinController()

    const httpResponse = await sut.handle({ token: '' })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The filed token is required')
    })
  })

  it('should return 400 if token is null', async () => {
    const sut = new FacebookLgoinController()

    const httpResponse = await sut.handle({ token: null })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The filed token is required')
    })
  })

  it('should return 400 if token is undefined', async () => {
    const sut = new FacebookLgoinController()

    const httpResponse = await sut.handle({ token: undefined })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The filed token is required')
    })
  })
})
