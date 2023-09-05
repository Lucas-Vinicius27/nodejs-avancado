export class ServerError extends Error {
  constructor (error?: Error | unknown) {
    super('Server failed. Try again soon')
    this.name = 'ServerError'
    this.stack = error instanceof Error ? error.stack : ''
  }
}

export class RequiredFieldError extends Error {
  constructor (fieldName: string) {
    super(`The filed ${fieldName} is required`)
    this.name = 'RequiredFieldError'
  }
}
