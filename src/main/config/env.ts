export const env = {
  facebookApi: {
    clientId: String(process.env.FB_CLIENT_ID) ?? '123456',
    clientSecret: String(process.env.FB_CLIENT_SECRET) ?? '123456'
  }
}
