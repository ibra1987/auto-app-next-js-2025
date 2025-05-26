import { dbClient } from "@/db/config";
import { inputValidtor } from "@/lib/utils";
import { AutoecoleSchema, CandidatSchema, CandidatType } from "@/types";
import { MongoClient } from "mongodb";
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

    const dbQueryResult = await client
      .db("autodb")
      .collection("candidats")
      .insertOne(newCandidat);
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


