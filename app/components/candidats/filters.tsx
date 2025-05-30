import { CategorieSchema } from "@/types"
import { ChangeEvent, useState } from "react"

type FiltersProps = {
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  selectedPaiementStatus: string;
  setSelectedPaiementStatus: (value: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
};

const Filters = ({
  selectedCategory,
  setSelectedCategory,
  selectedPaiementStatus,
  setSelectedPaiementStatus,
  searchQuery,
  setSearchQuery,
}: FiltersProps) => {
   
    const categories = CategorieSchema.options


    const handleChange=(e:ChangeEvent<HTMLInputElement | HTMLSelectElement>)=>{
        const {name , value} = e.target
        if(name ==="categorie"){
            setSelectedCategory(value)
        }
        if(name === "etat-paiement"){
            setSelectedPaiementStatus(value)
        }
        if(name === "recherche"){
            setSearchQuery(value)
        }
    }
  return (
    <div className="w-full flex justify-start items-center gap-4 p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-800">Filtres:</h2>
       <div className="flex  gap-2">
            <div className="flex justify-center items-center gap-2">
            <label htmlFor="search" className="text-sm text-gray-600">
            Rechercher par nom ou CIN
            </label>
            <input
            type="text"
            id="recherche"
            name="recherche"
            value={searchQuery}
            onChange={handleChange}
            placeholder="Entrez un nom ou un CIN"
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
        </div>
        <div className="flex justify-center items-center gap-2">
            <label htmlFor="category" className="text-sm text-gray-600">
            Filtrer par catégorie
            </label>
            <select
            onChange={handleChange}
            name="categorie"
            id="categorie"
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            value={selectedCategory}
            >
                <option value={""}>Catégorie </option>
           {categories.map((category) => (
            <option key={category} value={category}>
                {category}
            </option>
           ))}
            </select>
        </div>
        <div className="flex justify-center items-center gap-2">
            <label htmlFor="status" className="text-sm text-gray-600">
            Filtrer par statut de paiement
            </label>
            <select
            onChange={handleChange}
            value={selectedPaiementStatus}
            name="etat-paiement"
            id="etat-paiement"
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            >
            <option value="">Tous les statuts</option>
            <option value="paid">Payé</option>
            <option value="unpaid">Non payé</option>
            </select>
        </div>
       </div>
    </div>
  )
}

export default Filters
