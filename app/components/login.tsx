"use client"

import Button from "./button"




const LoginComponent = () => {
const inputStyle = " p-2 border border-gray-300 rounded w-full"
  return (
    <div className="w-full md:w-3/5 lg:w-2/5  flex flex-col justify-center items-center shadow-md bg-gray-100 p-10 rounded">
        <h1 className="my-10 text-2xl font-bold">Veuillez vous connecter</h1>
        <form className="w-full gap-2 flex flex-col justify-center items-center">
           
            <input className={inputStyle} type="text" placeholder="Nom d'utilsateur" name="username"/>
            <input className={inputStyle} type="password" placeholder="Mot de passs" name="password"/>
            <Button text="Se connecter" action={()=>{}} style="w-full text-white  leading-relaxed text-lg bg-black hover:bg-gray-800 p-2 cursor-pointer rounded"/>
        </form>
      
    </div>
  )
}

export default LoginComponent
