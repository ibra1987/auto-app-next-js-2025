"use client";
import {
  AdresseSchema,
  AutoecoleSchema,
  CandidatType,
  CategorieSchema,
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
  const queryClient = useQueryClient();
  const { auto } = useAutoStore();

  const [isEditing, setIsEditing] = useState(false);
  const [updatedCandidat, setUpdatedCandidat] = useState<Partial<CandidatType>>(selectedCandidat);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setUpdatedCandidat((prev) => ({
      ...prev,
      [name]:
        name === "prix"
          ? parseFloat(value)
          : name === "adresse"
          ? (value as unknown as (typeof AdresseSchema)["Enum"])
          : name === "categorie"
          ? (value as unknown as (typeof CategorieSchema)["Enum"])
          : name === "auto"
          ? (value as unknown as(typeof AutoecoleSchema)["Enum"])
          : value,
    }));
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async (candidat: Partial<CandidatType>) => {
      const res = await editCandidat(candidat);
      if (res.status === "failure") {
        toast.error(res.message);
        throw new Error(res.message);
      }

      toast.success(res.message);
    const oldAuto = auto;
    const newAuto = candidat.auto;

    // Remove from old auto-école list
    queryClient.setQueryData(
      ["liste-candidats", oldAuto],
      (oldData?: CandidatType[]) => {
        if (!oldData) return oldData;
        return oldData.filter(c => c._id !== candidat._id);
      }
    );

    // Add to new auto-école list (if changed)
    if (newAuto && newAuto !== oldAuto) {
      queryClient.setQueryData(
        ["liste-candidats", newAuto],
        (oldData?: CandidatType[]) => {
          if (!oldData) return [candidat as CandidatType];
          return [...oldData, candidat as CandidatType];
        }
      );
    } else {
      // No change in auto-école, just update in place
      queryClient.setQueryData(
        ["liste-candidats", oldAuto],
        (oldData?: CandidatType[]) => {
          if (!oldData) return oldData;
          return oldData.map(c =>
            c._id === candidat._id ? { ...c, ...candidat } : c
          );
        }
      );
    }

    // Optional: refetch both old and new if needed
    queryClient.invalidateQueries({ queryKey: ["liste-candidats", oldAuto] });
    if (newAuto && newAuto !== oldAuto) {
      queryClient.invalidateQueries({ queryKey: ["liste-candidats", newAuto] });
    }
  },
    
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
const changes: Partial<CandidatType> = { _id: selectedCandidat._id };
for (const key in updatedCandidat) {
  if (
    key !== "_id" &&
    updatedCandidat[key as keyof CandidatType] !== selectedCandidat[key as keyof CandidatType]
  ) {
    (changes as any)[key] = updatedCandidat[key as keyof CandidatType];
  }
}
    mutate(changes);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto bg-white p-4 rounded-xl">
      <h1 className="text-3xl font-bold text-black text-center mb-3">Menu de modification</h1>

      <div className="my-2 w-full flex gap-2 justify-start items-center">
        {isEditing && (
          <Button
            text={
              <span className="flex items-center gap-2">
                <Save size={14} />
                {isPending ? "Sauvegarde..." : "Sauvegarder"}
              </span>
            }
            attrs={{ type: "submit" }}
            style={`${
              isPending ? "bg-gray-600 text-gray-300" : "bg-black hover:bg-gray-700"
            } text-sm px-4 py-1 cursor-pointer text-white font-semibold rounded transition`}
          />
        )}

        <Button
          attrs={{ type: "button" }}
          action={(e) => {
            e?.preventDefault();
            setIsEditing(true);
          }}
          text={
            <span className="flex items-center gap-2">
              <Edit size={14} /> Modifier
            </span>
          }
          style="bg-green-800 hover:bg-green-700 text-sm px-4 py-1 cursor-pointer text-white font-semibold rounded transition"
        />

        {isEditing && (
          <Button
            attrs={{ type: "button" }}
            action={(e) => {
              e?.preventDefault();
              setUpdatedCandidat(selectedCandidat);
              setIsEditing(false);
            }}
            text={
              <span className="flex items-center gap-2">
                <Ban size={14} /> Annuler
              </span>
            }
            style="bg-gray-600 hover:bg-gray-700 text-sm px-4 py-1 cursor-pointer text-white font-semibold rounded transition"
          />
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        {[
          { id: "nom", label: "Nom du candidat", type: "text" },
          { id: "cin", label: "Numéro de CIN", type: "text" },
          { id: "tel", label: "Numéro de téléphone", type: "text" },
          { id: "prix", label: "Prix du service", type: "number" },
        ].map(({ id, label, type }) => (
          <div className="flex-grow basis-[48%]" key={id}>
            <label htmlFor={id} className="block mb-1 font-semibold text-sm text-gray-700">
              {label}
            </label>
            <input
              id={id}
              name={id}
              type={type}
              onChange={handleChange}
              value={updatedCandidat[id as keyof CandidatType] as string | number ?? ""}
              readOnly={!isEditing}
              disabled={!isEditing}
              className={`${
                !isEditing
                  ? "w-full p-3 border border-gray-300 rounded-md shadow-sm bg-black text-gray-300 outline-none"
                  : inputClass
              }`}
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
            value={updatedCandidat.adresse ?? ""}
            disabled={!isEditing}
            className={`${
              !isEditing
                ? "w-full p-3 border border-gray-300 rounded-md shadow-sm bg-black text-gray-300 outline-none"
                : inputClass
            }`}
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
            value={updatedCandidat.categorie ?? ""}
            disabled={!isEditing}
            className={`${
              !isEditing
                ? "w-full p-3 border border-gray-300 rounded-md shadow-sm bg-black text-gray-300 outline-none"
                : inputClass
            }`}
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
            value={updatedCandidat.auto ?? ""}
            disabled={!isEditing}
            className={`${
              !isEditing
                ? "w-full p-3 border border-gray-300 rounded-md shadow-sm bg-black text-gray-300 outline-none"
                : inputClass
            }`}
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
