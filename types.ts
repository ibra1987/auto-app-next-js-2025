import * as z from "zod"



const CandidateSchema = z.object({
    id:z.string().optional(),
    name:z.string().min(6,{message:"Le nom doit contenir au moins 6 charactères."}),
    cin:z.string().min(3,{message:"Merci de renseigner le numèro de la cin. "}),
    adresse:z.string().min(3,{message:"Merci de rensigner l'adresse du candidat."}),
    categorie:z.string().max(2,{message:"Merci de rensigner la catégorie demandée."}),
    price:z.number().positive({message:"Merci de renseigner le prix de la préstation."})

})

export type CandidateType = z.infer<typeof CandidateSchema>

export const TranchesSchema = z.object({
    id:z.string().optional(),
    candidatId:z.string({required_error:"aucun candidat seléctionné."}),
    montant:z.number().positive({message:"Merci d'entrer un montant plus que zéro."})

})

export type TrancheType = z.infer<typeof TranchesSchema>


export const VehiculeSchema = z.object({
    id:z.string().optional(),
    immat:z.string().min(4,{message:"Merci de rensigner le numèro d'immatriculation du véhicule."}),
    dateVisite:z.date({message:"Merci de renseigner la date de la visite."}),
    dateAssurance:z.date({message:"Merci de renseigner la date d'assurance."}),
    auto:z.string({required_error:"Chaque véhicule doit être affecté à une auto école."})
})


export type VehiculeType = z.infer<typeof VehiculeSchema>


export const ChargeSchema = z.object({
    id:z.string().optional(),
    libelle:z.string().min(4,{message:"Merci de rensigner le libellé de la charge."}),
    montant:z.number().positive({message:"Merci d'entrer un montant plus que zéro."}),
    nature:z.string().min(4,{message:"Merci de rensigner la nature de la charge."})

})