import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";



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
  // Custom options (optional)
  callbacks: {
    async session({ session, token }) {
      // Add user ID to the session object
      session.user.id = token.sub;
      return session;
    },
    async jwt({ token, account, profile }) {
      // Attach account and profile data to the token
      if (account) {
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
