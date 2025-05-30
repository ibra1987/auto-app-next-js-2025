"use client";

import { useQuery } from "@tanstack/react-query";
import { getCandidats } from "@/app/actions/candidats";
import { CandidatType } from "@/types";
import { useAutoStore } from "@/state";
import { toast } from "react-toastify";
import { Settings, X } from "lucide-react";
import { 
  useEffect,
  useState } from "react";
import CandidatSettings from "./candidat-settings";
import Filters from "./filters";

const CandidatList = () => {
   const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPaiementStatus, setSelectedPaiementStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const{ auto} = useAutoStore();
  const [id,setId]=useState("")
  const [showEditPannel,setEditPannel] =useState(false)
  const [displayedCandidats, setDisplayedCandidats] = useState<CandidatType[]>([]);


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

  useEffect(()=>{
  if(candidats){
    setDisplayedCandidats(candidats)
  }
  },[candidats])
  if (isLoading) return <div>Chargement...</div>;

  const anyFilterSet =
  selectedCategory || selectedPaiementStatus  || searchQuery.trim() !== "";

const filteredCandidats = anyFilterSet
  ? displayedCandidats.filter((c) => {
      const totalPaye = c.totalPaye ?? 0;
      const isPaid = totalPaye >=c.prix;

      const matchesCategory = selectedCategory ? c.categorie === selectedCategory : true;
      const matchesSearch =
        searchQuery !== ""
          ? c.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.cin.toLowerCase().includes(searchQuery.toLowerCase())
          : true;
      const matchesStatus =
        selectedPaiementStatus === "paid"
          ? isPaid
          : selectedPaiementStatus === "unpaid"
          ? !isPaid
          : true;

      return matchesCategory && matchesSearch && matchesStatus;
    })
  : displayedCandidats;
 


  //  candidat PANNEL HANDLE
  const selectedCandidat = filteredCandidats?.find((candidat) => candidat._id === id);
  const showCandidatPannel =(id:string)=>{
      setEditPannel(true)
      setId(id)

  }
// useMemo(()=>{
//      if (!candidats || !id) return undefined;
//    return candidats.find((c)=>c._id === id)
//   },[candidats,id]) 
  return (
    <div className=" flex flex-col gap-6 rounded-xl border border-gray-200 shadow-sm relative">
        {showEditPannel && selectedCandidat && (

                <div className="w-full flex justify-center items-center min-h-screen fixed top-0 left-0 bg-black/50">
                   
                    <CandidatSettings close={setEditPannel} selectedCandidat={selectedCandidat as CandidatType}/>
            </div>
            )}
<Filters
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedPaiementStatus={selectedPaiementStatus}
        setSelectedPaiementStatus={setSelectedPaiementStatus}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />      <table className="w-full text-sm text-left text-gray-700">
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
            filteredCandidats?.map((candidat) => (
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
                 <td className="px-4 text-center py-3">
  <div className="flex flex-col items-center gap-1">
   {candidat.prix !== candidat.totalPaye ? (
  <span className=" text-gray-600 text-xs">
    -{(candidat.prix - (candidat.totalPaye ?? 0))} DH restant
  </span>
) : null}
    <span
      className={`p-1 rounded-full text-xs font-semibold 
        ${candidat.prix > (candidat.totalPaye  ?? 0)
          ? "bg-red-600 text-white"
          : candidat.prix === candidat.totalPaye 
          ? "bg-green-600 text-white"
          : "bg-gray-200 text-gray-800"}
      `}
    >
      {candidat.totalPaye} DH payé
    </span>
  </div>
</td>

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
