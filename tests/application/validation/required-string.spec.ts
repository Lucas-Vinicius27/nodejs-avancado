import { RequiredFieldError } from '@/application/errors'
import { RequiredStringValidator } from '@/application/validation'

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

  it('should return undefined if value is not empty', () => {
    const sut = new RequiredStringValidator('any_value', 'any_field_name')

    const validate = sut.validate()

    expect(validate).toBeUndefined()
  })
})
