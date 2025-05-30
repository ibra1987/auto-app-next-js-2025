"use client"
import { Plus, X } from "lucide-react";
import Button from "../../components/button";
import AddCandidat from "../../components/candidats/add-candidat";
import { useState } from "react";
import CandidatList from "../../components/candidats/candidat-list";



export default  function CandidatsPage(){
const [showAddCandidatModal,setAddCandidatModal]=useState(false)


    return (
        <div className="w-full flex flex-col gap-6 justify-start items-center p-4 ">
            <div className="relative w-full flex justify-end items-center bg-gray- rounded-md border border-gray-200 p-4 ">
               <Button action={()=>setAddCandidatModal(true)} text={<span className="flex gap-2"><Plus/> Nouveau Candidat</span>} style="px-6 py-2 bg-black text-white cursor-pointer hover:text-gray-300 rounded-md"/>
               
            </div>
            {/**MODAL */}
            {showAddCandidatModal && (

                <div className="w-full flex justify-center items-center min-h-screen z-20 fixed top-0 left-0 bg-black/50">
                   
                    <AddCandidat close={setAddCandidatModal}/>
            </div>
            )}
            <CandidatList/>
        </div>
    )
}