"use client";

import { useRef, useState, useEffect } from "react";
import InfoCandidat from "./info-candidat";
import { CandidatType } from "@/types";
import { Contact, HandCoins, X } from "lucide-react";
import AddPaiment from "../paiements/add-paiement";

const CandidatSettings = ({selectedCandidat,close}:{close:(p:boolean)=>void,selectedCandidat:CandidatType}) => {
  const [selectedTab, setSelectedTab] = useState("info-candidat");

  const infoRef = useRef<HTMLSpanElement>(null);
  const paiementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Optional: focus the active tab when selected
    if (selectedTab === "info-candidat") {
      infoRef.current?.focus();
    } else {
      paiementRef.current?.focus();
    }
  }, [selectedTab]);

  
  return (
    <div className="w-full max-w-5xl h-screen mx-auto bg-white p-4 rounded-xl overflow-scroll ">
      <div className="flex justify-between gap-4 items-center mb-4 border-b border-b-gray-200 pb-2">
       <div className="flex-grow flex gap-2 justify-start items-center">
          <span
          ref={infoRef}
          tabIndex={0}
          onClick={() => setSelectedTab("info-candidat")}
          className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold ${
            selectedTab === "info-candidat"
              ? "bg-black text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
        <Contact size={14}/> <span> Infos du candidat</span>
        </span>
        <span
          ref={paiementRef}
          tabIndex={0}
          onClick={() => setSelectedTab("etat-paiement")}
          className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold ${
            selectedTab === "etat-paiement"
              ? "bg-black text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          <HandCoins size={14}/>  <span>État du paiement</span>
        </span>
       </div>
         <span onClick={()=>close(false)} className=" text-red-500 p-1 rounded-md border border-gray-300s hover:bg-red-500 hover:text-white">
                            <X />
                                </span>
      </div>

      <div>
        {selectedTab === "info-candidat" ? (
         <InfoCandidat selectedCandidat={selectedCandidat}/>
        ) : (
          <AddPaiment prix={selectedCandidat.prix} totalPaye={selectedCandidat.totalPaye} candidatId={selectedCandidat._id!} paiements={selectedCandidat.paiements}/>
        )}
      </div>
    </div>
  );
};

export default CandidatSettings;
