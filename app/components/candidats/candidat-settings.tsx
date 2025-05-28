"use client";

import { useRef, useState, useEffect } from "react";
import InfoCandidat from "./info-candidat";
import { CandidatType } from "@/types";
import { Contact, HandCoins } from "lucide-react";

const CandidatSettings = ({selectedCandidat}:{selectedCandidat:CandidatType}) => {
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
    <div className="w-full max-w-4xl h-screen mx-auto bg-white p-6 rounded-xl ">
      <div className="flex justify-start gap-4 items-center mb-4 border-b border-b-gray-200 pb-2">
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

      <div>
        {selectedTab === "info-candidat" ? (
         <InfoCandidat selectedCandidat={selectedCandidat}/>
        ) : (
          <p>Tableau des paiements ici...</p>
        )}
      </div>
    </div>
  );
};

export default CandidatSettings;
