"use client";

import { CandidatType, TranchesSchema, TrancheType } from "@/types";
import { ChangeEvent, useState } from "react";
import { inputClass } from "../candidats/add-candidat";
import Button from "../button";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addPaiement } from "@/app/actions/paiements";
import { inputValidtor } from "@/lib/utils";
import { useAutoStore } from "@/state";

const AddPaiment = ({
  candidatId,
  paiements,
  totalPaye,
}: {
  totalPaye: string | undefined;
  paiements: TrancheType[] | undefined;
  candidatId: string;
}) => {
  const queryClient = useQueryClient();
  const { auto } = useAutoStore();
  const [paiment, setPaiment] = useState<TrancheType>({
    candidatId,
    montant: 0,
    date: new Date(),
  });

  const resetForm = () => {
    setPaiment({
      candidatId,
      montant: 0,
      date: new Date(),
    });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setPaiment({
      ...paiment,
      [name]: (name === "date" && value !== "") ? new Date(value) : parseFloat(value ?? "0"),
    });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async (tranche: TrancheType) => {
      const res = await addPaiement(tranche);
      if (res.status === "failure") {
        toast.error(res.message);
      } else {
        toast.success(res.message);
        queryClient.setQueryData(
          ["liste-candidats", auto],
          (oldData: CandidatType[] | undefined) => {
            if (!oldData) return oldData;
            return oldData.map((cand) => {
              if (cand._id === candidatId) {
                const updatedPaiements = [...(cand.paiements || []), tranche];
                return {
                  ...cand,
                  paiements: updatedPaiements,
                  totalPaye: updatedPaiements.reduce(
                    (sum, p) => sum + p.montant,
                    0
                  ),
                };
              }
              return cand;
            });
          }
        );
      }
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors = inputValidtor(paiment, TranchesSchema);
    if (errors) {
      toast.error(errors[0].message);
      return;
    }
    mutate(paiment);
    await queryClient.invalidateQueries({ queryKey: ["", auto] });
  };

  return (
    <div className="w-full space-y-4">
      {paiements && totalPaye && (
        <>
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <table className="min-w-full text-sm text-left text-gray-700">
              <thead className="bg-black text-white uppercase text-xs font-semibold">
                <tr>
                  <th scope="col" className="px-4 text-center py-3 border-r border-gray-200">
                    Date
                  </th>
                  <th scope="col" className="px-4 py-3 text-center">
                    Montant (DH)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paiements.map((paiement) => (
                  <tr key={paiement._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-center">
                      {new Date(paiement.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 text-center">{paiement.montant}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-100 font-semibold">
                  <td className="px-4 py-2 text-right">Total :</td>
                  <td className="px-4 py-2 text-center">{totalPaye} DH</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </>
      )}

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl mx-auto flex flex-col justify-start gap-6 items-center bg-white  rounded-xl shadow-md"
      >
        <div className="w-full">
          <label
            htmlFor="montant"
            className="block mb-1 font-semibold text-sm text-gray-700"
          >
            Montant
          </label>
          <input
            onChange={handleChange}
            value={paiment.montant}
            className={inputClass + " w-full"}
            type="number"
            name="montant"
            placeholder="Montant"
          />
        </div>

        <div className="w-full">
          <label
            htmlFor="date"
            className="block mb-1 font-semibold text-sm text-gray-700"
          >
            Date de paiement
          </label>
          <input
            onChange={handleChange}
            value={paiment.date.toISOString().split("T")[0]}
            className={inputClass + " w-full"}
            type="date"
            name="date"
          />
        </div>

        <Button
          text={isPending ? "Sauvegarde en cours..." : "Sauvegarder"}
          style={`${
            isPending
              ? "bg-gray-600 text-gray-300"
              : "bg-black hover:bg-gray-700"
          } w-full cursor-pointer text-white font-semibold py-3 rounded-md transition`}
        />
      </form>
    </div>
  );
};

export default AddPaiment;
