"use client";

import { useQuery } from "@tanstack/react-query";
import { getCandidats } from "@/app/actions/candidats";
import { CandidatType } from "@/types";
import { useAutoStore } from "@/state";
import { toast } from "react-toastify";
import { Settings, X } from "lucide-react";
import { useMemo, useState } from "react";
import AddCandidat from "./add-candidat";
import CandidatSettings from "./candidat-settings";

const CandidatList = () => {
  const{ auto} = useAutoStore();
  const [id,setId]=useState("")
  const [showEditPannel,setEditPannel] =useState(false)

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

    enabled: !!auto, // Only run query if auto is defined
    refetchOnWindowFocus: false,
    retry: 0,
  });

  if (isLoading) return <div>Chargement...</div>;


  //  candidat PANNEL HANDLE
  const selectedCandidat = candidats?.find((candidat) => candidat._id === id);
  const showCandidatPannel =(id:string)=>{
      setEditPannel(true)
      setId(id)

  }
// useMemo(()=>{
//      if (!candidats || !id) return undefined;
//    return candidats.find((c)=>c._id === id)
//   },[candidats,id]) 
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-gray-200 shadow-sm relative">
        {showEditPannel && selectedCandidat && (

                <div className="w-full flex justify-center items-center min-h-screen fixed top-0 left-0 bg-black/50">
                    <span onClick={()=>setEditPannel(false)} className="absolute top-1/6 z-10 right-1/5 text-red-500 p-1 rounded-md border border-gray-300s hover:bg-red-500 hover:text-white">
                    <X />
                        </span>
                    <CandidatSettings selectedCandidat={selectedCandidat as CandidatType}/>
            </div>
            )}
      <table className="w-full text-sm text-left text-gray-700">
        <thead className="bg-black text-gray-300 border-b text-xs font-semibold uppercase ">
          <tr>
            <th className="px-4 py-3 text-center">Nom</th>
            <th className="px-4 py-3 text-center">CIN</th>
            <th className="px-4 py-3 text-center">Adresse</th>
            <th className="px-4 py-3 text-center">Téléphone</th>
            <th className="px-4 py-3 text-center">Catégorie</th>
            <th className="px-4 py-3 text-center">Prix</th>
             <th className="px-4 py-3 text-center">Etat paiement</th>
            <th className="px-4 py-3 text-center">Opérations</th>

             

          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {!candidats || candidats?.length === 0 ? (
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
                <td className="px-4 text-center py-3">{candidat.nom}</td>
                <td className="px-4 text-center py-3">{candidat.cin}</td>
                <td className="px-4 text-center py-3">{candidat.adresse}</td>
                <td className="px-4 text-center py-3">{candidat.tel || "—"}</td>
                <td className="px-4 text-center py-3">{candidat.categorie}</td>
                <td className="px-4 text-center py-3">{candidat.prix} DH</td>
                 <td className="px-4 text-center py-3">{1000} DH</td>
                 <td className="px-4 flex justify-center py-3"> <Settings onClick={()=>showCandidatPannel(candidat._id as string)} size={14} className="cursor-pointer hover:text-black hover:scale-110"/> </td>

              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CandidatList;
