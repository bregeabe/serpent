import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
const handle_google_auth = require('../../../db/utils/auth/handle-auth')

export default NextAuth({
  providers: [
    GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        authorization: {
          params: {
            scope: "openid email profile",
          },
        },
      }),
  ],
  debug: true,
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub;
      return session;
    },
    async jwt({ token, account, profile }) {
      if (account) {
        await handle_google_auth(profile.name, profile.email, profile.sub)
        token.accessToken = account.access_token;
        token.id = profile?.sub;
      }
      return token;
    },
  },
  pages: {
    signIn: '/setup/login',
    signOut: '/',
    newUser: '/dashboard',
  },
});
