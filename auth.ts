import NextAuth, { NextAuthConfig, } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "@/lib/db"

export const authOptions: NextAuthConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  trustHost: true,
  events: {
    signIn: async ({ user, account, profile, isNewUser }) => {
      console.log(`User signed in ${user.email}`)
    }
  },
  adapter: MongoDBAdapter(clientPromise),
};

export const { signIn, signOut, auth, handlers } = NextAuth(authOptions);