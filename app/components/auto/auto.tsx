"use client"
import { useAutoStore } from "@/state"
import { inputClass } from "../candidats/add-candidat"
import { AutoecoleSchema, AutoecoleType } from "@/types"




const Auto = () => {
    const {auto ,setAuto} =useAutoStore()
  return (
        <select
           onChange={(e)=>setAuto(e.target.value as unknown as AutoecoleType)}
             id="auto"
             name="auto"
             className={"border border-gray-500 p-2 bg-black text-white rounded-md"}
             value={auto}
           >
             <option value="">-- Choisir une auto école --</option>
             {AutoecoleSchema.options.map((a) => (
               <option key={a} value={a}>
                 {a}
               </option>
             ))}
           </select>
  )
}

export default Auto
