import { dbClient } from "@/db/config";
import { inputValidtor } from "@/lib/utils";
import {  CandidatSchema, CandidatType } from "@/types";
import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";

let client: MongoClient | null = null;
export async function POST(request: Request) {
  try {
    const newCandidat = (await request.json()) as CandidatType;

    const errors = inputValidtor(newCandidat, CandidatSchema);
    if (errors) throw new Error(JSON.stringify(errors));
    client = await dbClient();
    if (!client) throw new Error("Database connection failed");
    await client.connect();
   const { _id, ...candidatWithoutId } = newCandidat;

    const dbQueryResult = await client
      .db("autodb")
      .collection("candidats")
      .insertOne(candidatWithoutId);
      if(!dbQueryResult.insertedId) {
        throw new Error("Failed to insert document.");
      }
      return NextResponse.json({
        status:"success",
        message:"Candidat Ajouté avec succès",
        data:dbQueryResult.insertedId
      })
  } catch (error: any) {
    return NextResponse.json({
      status: "failure",
      message: "Il exist des erreurs dans votre requete.",
      data: Array.isArray(error)
        ? error
        : [{ message: "Error: check request to ADD CANDIDAT API" }],
    });
  }
}


// PUT REQUEST 

export async function PUT(request: Request) {
  try {
    const candidatToUpdate = (await request.json()) as CandidatType;

    const errors = inputValidtor(candidatToUpdate, CandidatSchema);
    if (errors) throw new Error(JSON.stringify(errors));
    client = await dbClient();
    if (!client) throw new Error("Database connection failed");
    await client.connect();
  
      const { _id, ...rest } = candidatToUpdate;

    const dbQueryResult = await client
      .db("autodb")
      .collection("candidats")
      .findOne({ _id: new ObjectId(candidatToUpdate._id) });
      if(!dbQueryResult?._id) {
        throw new Error("Aucun candidat trouvé.");
      }
      await client.db("autodb").collection("candidats").updateOne(
        { _id: new ObjectId(candidatToUpdate._id) },
        { $set: rest }
      );  
      return NextResponse.json({
        status:"success",
        message:"Info candidat mis à jour avec succès",
        data:dbQueryResult._id
      })
  } catch (error: any) {
    return NextResponse.json({
      status: "failure",
      message: "Il exist des erreurs dans votre requete.",
      data: Array.isArray(error)
        ? error
        : [{ message: "Error: check request to PUT CANDIDAT API" }],
    });
  }
}



