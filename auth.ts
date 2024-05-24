import NextAuth, { NextAuthConfig, } from "next-auth";
import GoogleProvider from "next-auth/providers/google";


export const authOptions: NextAuthConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  events: {
    signIn: async ({ user, account, profile, isNewUser }) => {
      console.log(`User signed in ${user.email}`)
    }
  }
};

export const { signIn, signOut, auth, handlers } = NextAuth(authOptions);