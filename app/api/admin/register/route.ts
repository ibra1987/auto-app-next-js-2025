import { DB_COLLECTIONS } from "@/app.config";
import { dbClient } from "@/db/config";
import { NewAdminSchema } from "@/types";
import { MongoClient } from "mongodb";
import { NextRequest, NextResponse } from "next/server";



let client: MongoClient | null = null;

export async function POST(req:NextRequest){

      const body = await req.json()

      if(!NewAdminSchema.safeParse(body)) throw new Error("Invalid request")
    try {
     client = await dbClient()
    if(!client) throw new Error("Database connection failed")
    await client.connect()
    const dbQueryResult = await client.db("autodb").collection(DB_COLLECTIONS.ADMINS).insertOne(body)
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
      await client?.close()
    }
}