
import { inputValidtor } from "@/lib/utils"
import { ActionResponseType, AutoecoleSchema, CandidatSchema, CandidatType, TranchesSchema, TrancheType, } from "@/types"
import * as z from "zod"


// GET /api/candidats @params autoId string
export async function  getCandidats(auto:string):Promise<ActionResponseType<CandidatType[] | string>>{
   try {
    const errors = inputValidtor(auto as unknown as typeof AutoecoleSchema,AutoecoleSchema)
    if(errors){
        throw new Error("Merci de spécifier l'auto ècole")
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/candidats/${auto}`,{
        method:"GET",
        headers:{
            "Content-Type":"application/json",

        },
       
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
export async function  addCandidat(candidat:CandidatType):Promise<ActionResponseType<z.ZodIssue[] | string>>{
   try {
    const errors =  inputValidtor(candidat,CandidatSchema)
    if(errors){
      
       return {
            status:"failure",
            message:"There was an error with you request.",
            data:errors
       }
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/candidats`,{
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
       return error as ActionResponseType<z.ZodIssue[] | string>
   }
}

// get single candidats


export async function  getCandidat(auto:string,id:string):Promise<ActionResponseType<CandidatType>>{
   try {
    const errors = inputValidtor(auto as unknown as typeof AutoecoleSchema,AutoecoleSchema)
    if(errors || !id){
        console.log(errors, id)
        throw new Error("Merci de spécifier l'auto ècole et l'id du candidat.")
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/candidats/${auto}/${id}`,{
        method:"GET",
        headers:{
            "Content-Type":"application/json",

        },
       
    })
    if(!response.ok){
        return {
            status:"failure",
            message:"Something went wrong.",
           
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

//EDIT CANDIDAT 


export async function  editCandidat(candidat:CandidatType):Promise<ActionResponseType<z.ZodIssue[] | string>>{
   try {
    const errors =  inputValidtor(candidat,CandidatSchema)
    if(errors){
      
       return {
            status:"failure",
            message:"There was an error with you request.",
            data:errors
       }
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/candidats`,{
        method:"PUT",
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
       return error as ActionResponseType<z.ZodIssue[] | string>
   }
}


