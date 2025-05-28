"use client"
import {
  AdresseSchema,
  AutoecoleSchema,
  AutoecoleType,
  
  CandidatType,
  CategorieSchema
} from "@/types";
import Button from "../button";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editCandidat } from "@/app/actions/candidats";
import { toast } from "react-toastify";
import { useAutoStore } from "@/state";
import { inputClass } from "./add-candidat";
import { Ban, Edit, Save } from "lucide-react";

const InfoCandidat = ({ selectedCandidat }: { selectedCandidat: CandidatType }) => {
      const queryClient = useQueryClient()

  const [edit, setEdit] = useState(false);
  const { setAuto ,auto} = useAutoStore();
  const [updatedCandidat, setUpdatedCandidat] = useState<CandidatType>(selectedCandidat);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;



    setUpdatedCandidat((prev) => ({
      ...prev,
      [name]:
        name === "prix" && value
          ? parseFloat(value)
          : name === "adresse"
          ? (value as unknown as typeof AdresseSchema.Enum)
          : name === "categorie"
          ? (value as unknown as typeof CategorieSchema.Enum)
          : name === "auto"
          ? (value as unknown as typeof AutoecoleSchema.Enum)
          : value,
    }));
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async (candidat: CandidatType) => {
      return await editCandidat(candidat);
    },
    onSuccess: () => {
      toast.success("Candidat modifié avec succès !");
      setEdit(false);
    queryClient.invalidateQueries({ queryKey: ["liste-candidats",auto] });
    if(selectedCandidat.auto !== updatedCandidat.auto){
             queryClient.invalidateQueries({ queryKey: ["liste-candidats",selectedCandidat.auto] });
   
    }


    },
    onError: (error) => {
      console.error("Erreur lors de la modification du candidat:", error);
      toast.error("Une erreur est survenue lors de la modification.");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updatedCandidat._id = selectedCandidat._id; 
    mutate(updatedCandidat);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto bg-white p-6 rounded-xl">
      <h1 className="text-3xl font-bold text-black text-center mb-6">
        Menu de modification
      </h1>

      <div className="my-4 w-full flex gap-2 justify-start items-center">
        {edit && (
          <Button
           
            text={
  <span className="flex items-center gap-2">
    <Save size={14}  />
    {isPending ? "Sauvegarde..." : "Sauvegarder"}
  </span>
}
            attrs={{ type: "submit" }}
            style={`${isPending
              ? " bg-gray-600 text-gray-300"
              : " bg-black hover:bg-gray-700"
              } text-sm px-4 py-1 cursor-pointer text-white font-semibold rounded transition`}
          />
        )}
        <Button
          attrs={{ type: "button" }}
          action={(e) => {
            e?.preventDefault();
            setEdit(true);
          }}
          text={<span className="flex items-center gap-2"><Edit size={14}/> Modifier</span>}
          style={`bg-green-800 hover:bg-green-700 text-sm px-4 py-1 cursor-pointer text-white font-semibold rounded transition`}
        />
        <Button
          attrs={{ type: "button" }}
          action={(e) => {
            e?.preventDefault();
            setUpdatedCandidat(selectedCandidat);
            setEdit(false);
          }}
          text={<span className="flex items-center gap-2"><Ban size={14}/> Annuler</span>}
          style={`bg-gray-600 hover:bg-gray-700 text-sm px-4 py-1 cursor-pointer text-white font-semibold rounded transition`}
        />
      </div>

      <div className="flex flex-wrap gap-3">
        {[
          { id: "nom", label: "Nom du candidat", type: "text" },
          { id: "cin", label: "Numéro de CIN", type: "text" },
          { id: "tel", label: "Numéro de téléphone", type: "text" },
          { id: "prix", label: "Prix du service", type: "number" },
        ].map(({ id, label, type }) => (
          <div className="flex-grow basis-[48%]" key={id}>
            <label htmlFor={id} className="block mb-1 font-semibold text-sm text-gray-700">{label}</label>
            <input
              id={id}
              name={id}
              type={type}
              onChange={handleChange}
              value={updatedCandidat[id as keyof CandidatType] as string | number}
              readOnly={!edit}
              disabled={!edit}
              className={`${!edit ? "w-full p-3 border border-gray-300 rounded-md shadow-sm bg-gray-200 text-black outline-none" : inputClass}`}
              placeholder={label}
            />
          </div>
        ))}

        <div className="flex-grow basis-[48%]">
          <label htmlFor="adresse" className="block mb-1 font-semibold text-sm text-gray-700">Adresse</label>
          <select
            id="adresse"
            name="adresse"
            onChange={handleChange}
            value={updatedCandidat.adresse}
            disabled={!edit}
            className={`${!edit ? "w-full p-3 border border-gray-300 rounded-md shadow-sm bg-gray-200 text-black outline-none" : inputClass}`}
          >
            <option value="">-- Choisir une adresse --</option>
            {AdresseSchema.options.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        <div className="flex-grow basis-[48%]">
          <label htmlFor="categorie" className="block mb-1 font-semibold text-sm text-gray-700">Catégorie</label>
          <select
            id="categorie"
            name="categorie"
            onChange={handleChange}
            value={updatedCandidat.categorie}
            disabled={!edit}
            className={`${!edit ? "w-full p-3 border border-gray-300 rounded-md shadow-sm bg-gray-200 text-black outline-none" : inputClass}`}
          >
            <option value="">-- Choisir une catégorie --</option>
            {CategorieSchema.options.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="flex-grow basis-[48%]">
          <label htmlFor="auto" className="block mb-1 font-semibold text-sm text-gray-700">Auto-école</label>
          <select
            id="auto"
            name="auto"
            onChange={handleChange}
            value={updatedCandidat.auto}
            disabled={!edit}
            className={`${!edit ? "w-full p-3 border border-gray-300 rounded-md shadow-sm bg-gray-200 text-black outline-none" : inputClass}`}
          >
            <option value="">-- Choisir une auto-école --</option>
            {AutoecoleSchema.options.map((auto) => (
              <option key={auto} value={auto}>{auto}</option>
            ))}
          </select>
        </div>
      </div>
    </form>
  );
};

export default InfoCandidat;
