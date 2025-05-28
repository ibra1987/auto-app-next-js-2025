import { dbClient } from "@/db/config";
import { inputValidtor } from "@/lib/utils";
import { TranchesSchema, TrancheType } from "@/types";
import { error } from "console";
import { MongoClient, ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";




let client : MongoClient | null = null

export async function POST(request:NextRequest){

    try {
        const newPaiement = await request.json() as TrancheType

        const errors = inputValidtor(newPaiement,TranchesSchema)
        if(errors) throw errors
       client = await dbClient()
       if(!client) throw new Error("Erreur de connexion à la base données.")

        await client.connect()
       const {_id,...rest}= newPaiement
        const dataToInsert = {
            ...rest,
            candidatId:new ObjectId(rest.candidatId)
        }
        const dbQueryResult = await client.db("autodb").collection("paiements").insertOne(dataToInsert)
        if(!dbQueryResult || !dbQueryResult.insertedId){
            throw new Error("Erreur lors de l'insertion du nouveau paiement.")
        }
        
        return NextResponse.json({
            status:"success",
            message:"Enregistré avec succès.",
            data:dbQueryResult.insertedId
        })

        
    } catch (error:any) {
        console.log(error)
        return NextResponse.json({
      status: "failure",
      message: error.message ?? "Il exist des erreurs dans votre requete.",
      data: Array.isArray(error)
        ? error
        : [{ message: "Error: check request to ADD PAIEMENT API" }],
    });
    }
}


export async function GET(request:NextRequest,{params}:{params:{candidatId:string}}){
    try {
        const {candidatId} = await params
        if(!candidatId) throw new Error("Merci de spécifier l' ID du candidat.")
        client = await dbClient()
    if(!client) throw new Error("Erreur de connexion à la base de données.")  
        await client.connect()
    const dbQueryResult = await client.db("autodb").collection("paiements").find({candidatId}).toArray()
        if(!dbQueryResult || dbQueryResult.length === 0){
        throw new Error("Aucun paiement trouvé pour ce candidat.")
        }
        return NextResponse.json({
            status:"succèss",
            data:dbQueryResult
        })
    
    
    
    
    } catch (error:any) {

        return NextResponse.json({
            status:"failure",
            message:error?.message ?? "erreur"
        })
    }
    }