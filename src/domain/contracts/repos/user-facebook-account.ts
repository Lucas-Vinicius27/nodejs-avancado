export interface SaveFacebookAccount {
  saveWithFacebook: (params: SaveFacebookAccount.Params) => Promise<SaveFacebookAccount.Result>
}

export namespace SaveFacebookAccount{
  export type Params = {
    id?: string
    email: string
    name: string
    facebookId: string
  }

  export type Result = {
    id: string
  }
}
