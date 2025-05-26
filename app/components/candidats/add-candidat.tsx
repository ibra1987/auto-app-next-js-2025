"use client"
import { AdresseSchema, AutoecoleSchema, AutoecoleType, CandidatSchema, CandidatType, CategorieSchema } from "@/types";
import Button from "../button";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addCandidat } from "@/app/actions/candidats";
import { toast } from "react-toastify";
import { inputValidtor } from "@/lib/utils";
import { useAutoStore } from "@/state";

 export const inputClass =
    "w-full p-3 border border-gray-300 rounded-md shadow-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-black transition";
const AddCandidat = () => {
  const queryClient = useQueryClient()
  const{ auto,setAuto} =useAutoStore()
  const [newCandidat,setNewCandidat]=useState({
nom:"",
cin:"",
adresse:"",
categorie:"",
prix:0,
tel:"",
auto:auto

})
 

    //handlers
const resetForm = () => {
    setNewCandidat({
      nom: "",
      cin: "",
      adresse: "",
      categorie: "",
      prix: 0,
      tel: "",
      auto:auto
    });
}
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value } = e.target;
  if(name === "auto"){
    setAuto(value as AutoecoleType)
  }
  setNewCandidat((prev) => ({
    ...prev,
    [name]:
  name === "prix" && value ? parseFloat(value) 

        :name === "adresse"

        ? value as unknown as typeof AdresseSchema.Enum
        : name === "categorie"
        ? value as unknown as typeof CategorieSchema.Enum
        :name === "auto" 
        ? value as unknown as typeof AutoecoleSchema.Enum
        : value,
  }));
};

    

    //mutation

   const { mutate,isPending } = useMutation({
    mutationFn: async (candidat: CandidatType) => {
      console.log("Mutating with:", candidat);
      return await addCandidat(candidat)},
    onSuccess: () => {
     
      toast.success("Candidat ajouté avec succès !");
       resetForm();
    },
    onError: (error) => {
      console.error("Erreur lors de l'ajout du candidat:", error);
      toast.error("Une erreur est survenue lors de l'ajout du candidat.");
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
   console.log(newCandidat)
   const errors = inputValidtor(newCandidat,CandidatSchema)
   if(errors){
    toast.error(errors[0].message)
    return
   }
     mutate(newCandidat as CandidatType)
     queryClient.invalidateQueries({ queryKey: ["liste-candidats", auto] });
    
  }
  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md">
      <h1 className="text-3xl font-bold text-black text-center mb-6">
        Ajouter un candidat
      </h1>

      {/* Container flex row, wrap, gap entre champs */}
      <div className="flex flex-wrap gap-6">
        {/* Chaque champ prend 48% de largeur (2 colonnes avec un peu d’espace) */}
        <input 
        onChange={handleChange}
        value={newCandidat.nom}
          className={inputClass + " flex-grow basis-[48%]"}
          type="text"
          name="nom"
          placeholder="Nom du candidat"
        />
        <input 
        onChange={handleChange}
          className={inputClass + " flex-grow basis-[48%]"}
          type="text"
          name="cin"
          placeholder="N° de la CIN"
          value={newCandidat.cin}
        />
        <input 
        onChange={handleChange}
          className={inputClass + " flex-grow basis-[48%]"}
          type="text"
          name="tel"
          placeholder="N° de téléphone"
          value={newCandidat.tel}
        />
        <input 
        onChange={handleChange}
          className={inputClass + " flex-grow basis-[48%]"}
          type="number"
          name="prix"
          placeholder="Prix du service"
          value={newCandidat.prix}
        />
        <select
        onChange={handleChange}
          id="adresse"
          name="adresse"
          className={inputClass + " flex-grow basis-[48%]"}
          value={newCandidat.adresse}
        >
          <option value="">-- Choisir une adresse --</option>
          {AdresseSchema.options.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
        <select
        onChange={handleChange}
          id="categorie"
          name="categorie"
          className={inputClass + " flex-grow basis-[48%]"}
          value={newCandidat.categorie}
        >
          <option value="">-- Choisir une catégorie --</option>
          {CategorieSchema.options.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
         <select
        onChange={handleChange}
          id="auto"
          name="auto"
          className={inputClass + " flex-grow basis-[48%]"}
          value={newCandidat.auto}
        >
          <option value="">-- Choisir une auto école --</option>
          {AutoecoleSchema.options.map((auto) => (
            <option key={auto} value={auto}>
              {auto}
            </option>
          ))}
        </select>
      </div>

      {/* Bouton full width en dessous */}
      <div className="mt-8">
        <Button
          text={isPending ? "Ajout en cours..." : "Ajouter le candidat"}
          
          style={`${isPending ? " bg-gray-600 text-gray-300" : " bg-black hover:bg-gray-700 "}" w-full cursor-pointer   text-white font-semibold py-3 rounded-md transition"`}
        
        />
      </div>
    </form>
  );
};

export default AddCandidat;
