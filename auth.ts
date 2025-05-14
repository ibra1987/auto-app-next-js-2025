import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { AdminSchema, AdminType } from "./types"
import { inputValidtor } from "./lib/utils"
import { loginAdminAction } from "./app/actions/admin"
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
        Credentials({
        name:"credentails",
        
        async authorize(creds: Partial<Record<string, unknown>>) {
           try {
                const creadentials: AdminType = {
                    username: creds.username as string,
                    password: creds.password as string
                };
                const errors = inputValidtor(creadentials, AdminSchema);
                if (errors) return null;
                const admin = await loginAdminAction(creadentials);
                if (admin && admin.status === "success" && admin.data) {
                    // Return a User object as expected by NextAuth
                    return {
                        id: admin.data._id,
                        username: admin.data.username
                    };
                }
                return null;
           } catch (error) {
               return null
               
           }
        }
    })
  ],
  session:{
    strategy:"jwt"
  },
  secret:process.env.AUTH_SECRET!
})