
import { ActionResponseType, CandidateSchema, CandidateType } from "@/types"
import * as z from "zod"


// GET /api/candidats @params autoId string
export async function  getCandidats(autoId:string):Promise<ActionResponseType<CandidateType[] | z.ZodIssue[]>>{
   try {
    const validationResult =  z.string().min(4).safeParse(autoId)
    if(!validationResult.success){
        return {
            status:"failure",
            message:"Invalid request",
            data:validationResult.error.errors
        }
    }
    const response = await fetch("/api/candidats",{
        method:"GET",
        headers:{
            "Content-Type":"application/json",

        },
        body:JSON.stringify({autoId})
    })
    if(!response.ok){
        return {
            status:"failure",
            message:"Something went wrong.",
            data:[]
        }
    }
     return await response.json()
   } catch (error) {
       return {
        status:"failure",
        message:`${error && typeof error === "object" && "message" in error ? error.message  : "Server error"}`
       }
   }
}


// POST /api/Candidats @param candidat CandidatType
export async function  addCandidat(candidat:CandidateType):Promise<ActionResponseType<z.ZodIssue[] | string>>{
   try {
    const validationResult =  CandidateSchema.safeParse(candidat)
    if(!validationResult.success){
       const errors = validationResult.error.errors
       return {
            status:"failure",
            message:"There was an error with you request.",
            data:errors
       }
    }
    const response = await fetch("/api/candidats",{
        method:"POST",
        headers:{
            "Content-Type":"application/json",

        },
        body:JSON.stringify(candidat)
    })
    if(!response.ok){
        return {
            status:"failure",
            message:"Something went wrong."
        }
    }
     return await response.json()
   } catch (error) {
       return {
        status:"failure",
        message:`${error && typeof error === "object" && "message" in error ? error.message  : "Server error"}`
       }
   }
}