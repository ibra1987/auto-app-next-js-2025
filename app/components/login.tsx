"use client"

import { ChangeEvent, useState } from "react"
import Button from "./button"
import { AdminSchema, AdminType } from "@/types"
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { inputValidtor } from "@/lib/utils";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

 type FieldErrors = {
  generic: string;
  username: string;
  password: string;
};


const LoginComponent = () => {
  const router = useRouter()
  const [errors,setErrors]=useState<FieldErrors>({
    generic:"",
    username:"",
    password:""
  })
  const [creds,setCreds]= useState<AdminType>({
      username:"",
      password:""
  })
const inputStyle = " p-2 border border-gray-300 rounded w-full"

//change handler 

  const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const name = e.target.name;
     setErrors({...errors,[name]:""})
    setCreds({
      ...creds,
      [name]: value.trim(),
    });
  };
// mutation 

  const mutation = useMutation({
    mutationFn:async(creds:AdminType)=>{
    
 
  
        const res =  await signIn("credentials",{...creds,redirect:false})
       if (!res || res.error || !res.ok) {
           throw new Error("Nom d'utilisateur ou mot de passe incorrect.");
       }else {
        router.push("/in")
       }

      
  
    },
    onSuccess:()=>{
      toast.success("Connexion réussie, redirection...")
    },
    onError:(e:Error)=>{
        toast.error(e.message as string)
    }
  })

//form submission

  const handleSubmit=(e:React.FormEvent)=>{
    e.preventDefault()
    setErrors({
    generic: "",
    username: "",
    password: "",
  });
    const fieldErrors = inputValidtor(creds,AdminSchema)
         if(fieldErrors !== null){
             const newErrors = {
                generic:"",
                username:"",
                password:"",
                confirmPassword:""
            }
           fieldErrors.forEach((e)=>newErrors[e.path[0] as keyof typeof newErrors]=e.message)
           setErrors(newErrors)
            return 
         }
    mutation.mutate(creds)
  }


  return (
    <div className="w-full md:w-3/5 lg:w-2/5  flex flex-col justify-center items-center shadow-md bg-gray-100 p-10 rounded">
        <h1 className="my-10 text-2xl font-bold">Veuillez vous connecter</h1>
        <form onSubmit={handleSubmit} className="w-full gap-2 flex flex-col justify-center items-center">
           
            <input onChange={changeHandler} value={creds.username} 
             className={`${
            errors.username ? "border-red-500" : "border-gray-300"
          } ${inputStyle}`}
            type="text" placeholder="Nom d'utilsateur" name="username"/>
             <span className="block w-full text-sm text-left p-1 text-red-500">
          {errors.username}{" "}
        </span>
            <input onChange={changeHandler} value={creds.password}
              className={`${
            errors.password ? "border-red-500" : "border-gray-300"
          } ${inputStyle}`}
            type="password" placeholder="Mot de passs" name="password"/>
            <span className="block w-full text-sm text-left p-1 text-red-500">
          {errors.password}{" "}
        </span>
            <Button text="Se connecter"  style="w-full text-white  leading-relaxed text-lg bg-black hover:bg-gray-800 p-2 cursor-pointer rounded"/>
        </form>
      
    </div>
  )
}

export default LoginComponent
