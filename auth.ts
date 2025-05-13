import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { AdminType } from "./types"
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
        name:"credentails",
        async authorize(creadentials:AdminType){





            return {
                
            }

        }
    })
  ],
})