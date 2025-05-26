"use client"

import Button from "../button"


const CandidatsHeaderWrapper = () => {
    const openAddCandidatForm =()=>{
        
    }
  return (
    <div className="w-full">
       <Button text="Ajouter un candidat" style="px-6 py-2 bg-black text-white hover:text-gray-300" action={openAddCandidatForm} />
    </div>
  )
}

export default CandidatsHeaderWrapper
