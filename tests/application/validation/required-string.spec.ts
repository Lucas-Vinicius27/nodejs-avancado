import { RequiredFieldError } from '@/application/errors'

class RequiredStringValidator {
  constructor (
    private readonly value: string,
    private readonly fieldName: string
  ) {}

  validate (): Error | undefined {
    if (
      this.value === '' ||
      this.value === null ||
      this.value === undefined
    ) return new RequiredFieldError(this.fieldName)
  }
}

describe('RequiredStringValidator', () => {
  it('should return RequiredFieldError if value is empty', () => {
    const sut = new RequiredStringValidator('', 'any_field_name')

    const error = sut.validate()

    expect(error).toEqual(new RequiredFieldError('any_field_name'))
  })

  it('should return RequiredFieldError if value is null', () => {
    const sut = new RequiredStringValidator(null as any, 'any_field_name')

    const error = sut.validate()

    expect(error).toEqual(new RequiredFieldError('any_field_name'))
  })

  it('should return RequiredFieldError if value is undefined', () => {
    const sut = new RequiredStringValidator(undefined as any, 'any_field_name')

    const error = sut.validate()

    expect(error).toEqual(new RequiredFieldError('any_field_name'))
  })
})
