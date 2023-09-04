export class ServerError extends Error {
  constructor (error?: Error | unknown) {
    super('Server failed. Try again soon')
    this.name = 'ServerError'
    this.stack = error instanceof Error ? error.stack : ''
  }
}
