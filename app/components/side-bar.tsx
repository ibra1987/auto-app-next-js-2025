import { Banknote, CarIcon, UserRoundCog, Users } from "lucide-react"
import Link from "next/link"
import Auto from "./auto/auto"


const menuItems = [
    {
        name:"Candidats",
        icon:<Users  size={14} /> ,
        path:"/in/candidats"
    },
     {
        name:"Charges",
        icon:<Banknote size={14}  />,
        path:"/charges"
    },
     {
        name:"Véhicules",
        icon:<CarIcon  size={14} />,
        path:"/vehicules"
    },
     {
        name:"Personnel",
        icon:<UserRoundCog size={14}  />,
        path:"/personnel"
    }
]

const Sidebar = () => {
  return (
    <aside className="w-64 h-screen flex flex-col justify-start items-start gap-6  p-4 border-r  border-r-gray-700">
      <Auto/>
       <ul className="w-full flex flex-col justify-start items-start">
            {menuItems.map((item)=><li key={item.name} className="w-full flex justify-center items-center p-2 "><Link className="w-full flex justify-start items-center gap-3 text-gray-300n hover:text-gray-400" href={item.path}><span>{item.icon} </span><span>{item.name}</span></Link></li>)}
       </ul>
    </aside>
  )
}

export default Sidebar
