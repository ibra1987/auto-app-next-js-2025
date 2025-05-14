"use client";

import { NewAdminSchema, NewAdminType } from "@/types";
import Button from "./button";
import { ChangeEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { registerAdminAction } from "../actions/admin";
import { toast } from "react-toastify";
import { ZodIssue } from "zod";
import { inputValidtor } from "@/lib/utils";


 type FieldErrors = {
  generic: string;
  username: string;
  password: string;
  confirmPassword: string;
};

const RegisterComponent = () => {
  const [newAdmin, setNewAdmin] = useState<NewAdminType>({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({
    generic: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const inputStyle = " p-2 border  rounded w-full";
  // change handler
  const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const name = e.target.name;
     setErrors({...errors,[name]:""})
    setNewAdmin({
      ...newAdmin,
      [name]: value.trim(),
    });
  };

  //mutation
  const mutation = useMutation({
    mutationFn:async (newAdmin:NewAdminType)=>{
         
        const response = await registerAdminAction(newAdmin)
    if(response.status !== "success"){
        throw new Error(JSON.stringify(response.data))
    }
    return response.data
    },
    onSuccess:(data)=>{
        toast.success("Enregistré avec succès.")

    },
    onError:(err:any)=>{
        if(typeof err === "object" && "message" in err && Array.isArray(JSON.parse(err.message)) ){
            const errs =  JSON.parse(err.message) as ZodIssue[]
            const newErrors = {
                generic:"",
                username:"",
                password:"",
                confirmPassword:""
            }
           errs.forEach((e)=>newErrors[e.path[0] as keyof typeof newErrors]=e.message)
           setErrors(newErrors)
         return
        }
        console.log("",err)
        if(typeof err === "object" && "message" in err && typeof err.message === "string"){
            setErrors({
                ...errors,
                generic:err.message
            })
        }
    }
  })

  const handleSubmit=(e:React.FormEvent)=>{
    e.preventDefault()
    setErrors({
    generic: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
    const fieldErrors = inputValidtor(newAdmin,NewAdminSchema)
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
    mutation.mutate(newAdmin)
  }
  //register new user function

  
  return (
    <div className="w-full md:w-3/5 lg:w-2/5  flex flex-col justify-center items-center shadow-md border border-gray-400 p-10 rounded">
      {errors.generic && (
        <div className="w-full rounded p-4 text-red-600 bg-red-100">
          {errors.generic}
        </div>
      )}
      <h1 className="my-10 text-2xl font-bold">Veuillez vous connecter</h1>
      <form onSubmit={handleSubmit} className="w-full gap-2 flex flex-col justify-center items-center">
        <input
          onChange={changeHandler}
          value={newAdmin.username}
          className={` ${
            errors.username ? " border-red-500 " : " border-gray-300"
          } ${inputStyle} `}
          type="text"
          placeholder="Nom d'utilsateur"
          name="username"
        />
        <span className="block w-full text-sm text-left p-1 text-red-500">
          {errors.username}{" "}
        </span>
        <input
          onChange={changeHandler}
          value={newAdmin.password}
          className={`${
            errors.password ? "border-red-500" : "border-gray-300"
          } ${inputStyle}`}
          type="password"
          placeholder="Mot de passe"
          name="password"
        />
        <span className="block w-full text-sm text-left p-1 text-red-500">
          {errors.password}{" "}
        </span>

        <input
          onChange={changeHandler}
          value={newAdmin.confirmPassword}
          className={` ${
            errors.confirmPassword ? " border-red-500" : " border-gray-300"
          } ${inputStyle} `}
          type="password"
          placeholder="Confirmer Mot de passs"
          name="confirmPassword"
        />
        <span className="block w-full text-sm text-left p-1 text-red-500">
          {errors.confirmPassword}{" "}
        </span>

        <Button
          text={mutation.isLoading ? "Patientez ...":"S'inscrire"}
          attrs={{
            disabled:mutation.isLoading
          }}
      
          style="w-full text-white  leading-relaxed text-lg bg-black hover:bg-gray-800 p-2 cursor-pointer rounded"
        />
      </form>
    </div>
  );
};

export default RegisterComponent;
