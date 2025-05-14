import { DB_COLLECTIONS } from "@/app.config"
import { requireDb } from "@/db/config"
import { comparePassword } from "@/lib/serverhelpers"
import { inputValidtor } from "@/lib/utils"
import { AdminSchema, AdminType } from "@/types"
import { WithId } from "mongodb"
import { NextResponse } from "next/server"
import { ZodIssue } from "zod"



export async function POST(req:Request){


    try {
        const adminCreds = await req.json() as AdminType
        const errors = inputValidtor(adminCreds,AdminSchema)
        if(errors){
            throw new Error(JSON.stringify(errors))
        }
        const db = await requireDb()
    
        const isAdmin = await db.collection(DB_COLLECTIONS.ADMINS).findOne<WithId<AdminType>>({username:adminCreds.username})
        if(!isAdmin || !isAdmin._id){
            throw new Error(JSON.stringify([{code:"custom",message:"Invalid credentials",path:["generic"]}]))
        }
        const passMatch = await comparePassword(adminCreds.password,isAdmin.password)
        if(!passMatch) throw new Error(JSON.stringify([{path:["generic"],code:"custom",message:"Invalid credentials"}]))
    
         const {password,...data} = isAdmin
         return NextResponse.json({
            status:"success",
            data
         },{status:200})
        } catch (error:any) {
            return NextResponse.json({
                status:"failure",
                data:error.message as ZodIssue[]
            },{status:500})
    }
}