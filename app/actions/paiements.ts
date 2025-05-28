"use server"

import { inputValidtor } from "@/lib/utils"
import { ActionResponseType, TranchesSchema, TrancheType } from "@/types"
import { ZodIssue } from "zod"




export async function addPaiement(paiment:TrancheType){
    try {
        const errors = inputValidtor(paiment,TranchesSchema)

        if(errors){
            throw new Error("Merci de vérifier les données.")
        }
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/paiements/`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(paiment)
        })
        if(!response.ok){
            throw new Error("Erreur lors de l'insertion des donées,"+response.statusText)
        }
        return await response.json()
    } catch (error) {
               return error as ActionResponseType<ZodIssue[] | string>

    }
}


// get Paiements 


export async function getPaiments(candidatId:string){
    try {
        if(!candidatId) throw new Error("Merci de spécifier l' ID du candidat.")
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/paiements/${candidatId}`,{
            method:"GET",
            headers:{
                "Content-Type":"application/json"
            }
        })
        if(!response.ok){
            throw new Error("Erreur lors de la récupération des paiements,"+response.statusText)
        }
        return await response.json()
    } catch (error) {
        return error as ActionResponseType<ZodIssue[] | string>
    }
}