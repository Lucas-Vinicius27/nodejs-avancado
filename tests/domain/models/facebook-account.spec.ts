import { FacebookAccount } from '@/domain/models'

describe('FacebookAccount', () => {
  const userFacebook = {
    name: 'any_fb_name',
    email: 'any_fb_email',
    facebookId: 'any_fb_id'
  }

  it('should create with facebook data only', () => {
    const sut = new FacebookAccount(userFacebook)

    expect(sut).toEqual(userFacebook)
  })

  it('should update name if its empty', () => {
    const accountData = { id: 'any_id' }

    const sut = new FacebookAccount(userFacebook, accountData)

    expect(sut).toEqual({
      ...accountData,
      ...userFacebook
    })
  })

  it('should not update name if its not empty', () => {
    const accountData = { id: 'any_id', name: 'any_name' }

    const sut = new FacebookAccount(userFacebook, accountData)

    expect(sut).toEqual({
      id: accountData.id,
      name: accountData.name,
      email: userFacebook.email,
      facebookId: userFacebook.facebookId
    })
  })
})
