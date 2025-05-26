"use client"
import { X } from "lucide-react";
import Button from "../components/button";
import AddCandidat from "../components/candidats/add-candidat";
import { useState } from "react";
import { CandidatType } from "@/types";
import CandidatList from "../components/candidats/candidat-list";



export default  function CandidatsPage(){
const [showAddCandidatModal,setAddCandidatModal]=useState(false)


    return (
        <div className="w-full flex flex-col gap-6 justify-start items-center p-4 ">
            <div className="relative w-full flex justify-end items-center bg-gray- rounded-md border border-gray-200 p-4 ">
               <Button action={()=>setAddCandidatModal(true)} text="Ajouter un candidat" style="px-6 py-2 bg-black text-white cursor-pointer hover:text-gray-300 rounded-md"/>
               
            </div>
            {/**MODAL */}
            {showAddCandidatModal && (

                <div className="w-full flex justify-center items-center min-h-screen fixed top-0 left-0 bg-black/50">
                    <span onClick={()=>setAddCandidatModal(false)} className="absolute top-1/6 z-10 right-1/5 text-red-500 p-1 rounded-md border border-gray-300s hover:bg-red-500 hover:text-white">
                    <X />
                        </span>
                    <AddCandidat/>
            </div>
            )}
            <CandidatList/>
        </div>
    )
}