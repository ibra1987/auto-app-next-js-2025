"use client";

import { useQuery } from "@tanstack/react-query";
import { getCandidats } from "@/app/actions/candidats";
import { CandidatType } from "@/types";
import { useAutoStore } from "@/state";
import { toast } from "react-toastify";

const CandidatList = () => {
  const auto = useAutoStore((state) => state.auto);

  const {
    data: candidats,
    isLoading,
    isError,
  } = useQuery<CandidatType[]>({
    queryKey: ["liste-candidats", auto],
    queryFn: async () => {
      const res = await getCandidats(auto);
      if (res.status === "failure") {
        toast.error(res.message || "Erreur lors de la récupération des candidats.");
        throw new Error("Erreur lors de la récupération");
      }
      return res.data as CandidatType[];
    },
  });

  if (isLoading) return <div>Chargement...</div>;
  if (isError) return <div>Erreur lors du chargement des candidats.</div>;

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
      <table className="w-full text-sm text-left text-gray-700">
        <thead className="bg-black text-gray-300 border-b text-xs font-semibold uppercase ">
          <tr>
            <th className="px-4 py-3">Nom</th>
            <th className="px-4 py-3">CIN</th>
            <th className="px-4 py-3">Adresse</th>
            <th className="px-4 py-3">Téléphone</th>
            <th className="px-4 py-3">Catégorie</th>
            <th className="px-4 py-3">Prix</th>
             <th className="px-4 py-3">Etat paiement</th>

          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {candidats?.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                Aucun candidat trouvé.
              </td>
            </tr>
          ) : (
            candidats?.map((candidat) => (
              <tr
                key={candidat._id}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="px-4 py-3">{candidat.nom}</td>
                <td className="px-4 py-3">{candidat.cin}</td>
                <td className="px-4 py-3">{candidat.adresse}</td>
                <td className="px-4 py-3">{candidat.tel || "—"}</td>
                <td className="px-4 py-3">{candidat.categorie}</td>
                <td className="px-4 py-3">{candidat.prix} DH</td>
                 <td className="px-4 py-3">{1000} DH</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CandidatList;
