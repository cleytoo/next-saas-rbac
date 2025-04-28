export class BadRequestError extends Error {
  name = 'BadRequestError'
}

export class UnauthorizedError extends Error {
  constructor(message = 'Unauthorized') {
    super(message)
  }

  name = 'UnauthorizedError'
}
