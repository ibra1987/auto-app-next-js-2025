import { dbClient } from "@/db/config";
import { inputValidtor } from "@/lib/utils";
import { AutoecoleSchema, AutoecoleType } from "@/types";
import { MongoClient, ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

let client: MongoClient | null = null
export async function GET(request:NextRequest,{params}:{params:Promise<{auto:string,id:string}>}){
   const {auto,id} = await params;


    try {
         if(!auto || inputValidtor(auto as unknown as typeof AutoecoleSchema ,AutoecoleSchema) || !id){
                throw new Error("manque auto ou id.")
            }
       client = await dbClient()
       if(!client) throw new Error("Erreur de connexion à la base de données.")

        await client.connect()
        const _id = new ObjectId(id)
        const dbQueryResult = await client.db("autodb").collection("candidats").findOne({auto,_id})
        if(!dbQueryResult || !dbQueryResult?._id) throw new Error("candidat introuvable.")
            return NextResponse.json({
        status:"success",
    data:dbQueryResult},{status:200})
        
    } catch (error:any) {
        return NextResponse.json({
            status:"failure",
            message: error.message as string || "Une erreur est survenu."
        },{status:error.message ? 400 : 500})
    }
    finally {
        await client?.close()
    }

}

