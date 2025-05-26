import { dbClient } from "@/db/config";
import { inputValidtor } from "@/lib/utils";
import { AutoecoleSchema } from "@/types";
import { MongoClient } from "mongodb";
import { NextRequest, NextResponse } from "next/server";



let client : MongoClient | null = null
export async function GET(req:NextRequest,{params}:{params:Promise<{auto:string}>}){

  try {
    const {auto} =( await params) 
  console.log(auto)
    if(!auto || inputValidtor(auto as unknown as typeof AutoecoleSchema ,AutoecoleSchema)){
        throw new Error("Veuillez selectionner une auto école.")
    }
    client = await dbClient()
    if(!client) throw new Error("Erreur de connexion à la base de données.")
    await client.connect()
     const dbQueryResult = await client.db("autodb").collection("candidats").find({auto}).toArray()
     if(!dbQueryResult || !dbQueryResult.length){
        throw new Error("Aucun enregistrement")
     }
     return NextResponse.json({
        status:"success",
        data:dbQueryResult,
        
     })
  } catch (error:any) {
    return NextResponse.json({
        status:"failure",
        message:error?.message as string || "Une erreur est survenue."
    })
  }finally {
    await client?.close()
  }

}