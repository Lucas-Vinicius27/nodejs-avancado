import { RequiredFieldError } from '@/application/errors'

class RequiredStringValidator {
  constructor (
    private readonly value: string,
    private readonly fieldName: string
  ) {}

  validate (): Error | undefined {
    if (this.value === '') return new RequiredFieldError(this.fieldName)
  }
}

describe('RequiredStringValidator', () => {
  it('should return RequiredFieldError if value is empty', () => {
    const sut = new RequiredStringValidator('', 'any_field_name')

    const error = sut.validate()

    expect(error).toEqual(new RequiredFieldError('any_field_name'))
  })
})
