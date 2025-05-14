import { DB_COLLECTIONS } from "@/app.config";
import { disconnectDB, requireDb } from "@/db/config";
import { NewAdminSchema } from "@/types";
import { NextResponse } from "next/server";




export async function POST(req:Request){

      const body = await req.json()

      if(!NewAdminSchema.safeParse(body)) throw new Error("Invalid request")
    try {
    const db = await requireDb()
    const dbQueryResult = await db.collection(DB_COLLECTIONS.ADMINS).insertOne(body)
    if(!dbQueryResult.insertedId){
        throw new Error("Failed to insert document.")
    }
    return NextResponse.json({
        status:"success",
        data:dbQueryResult.insertedId
    },{status:201})
        
    } catch (error) {
        return NextResponse.json({
            status:"failure",
            data:[{code:"custom",path:["generic"],message:`${error && typeof error === "object" && "message" in error ? error.message  : "Server error"}`}]
        })
    } finally{
       await disconnectDB()
    }
}