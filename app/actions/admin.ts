"use server";

import { API_ROUTES } from "@/app.config";
import { hashPassword } from "@/lib/serverhelpers";
import { ActionResponseType, AdminSchema, AdminType, NewAdminSchema, NewAdminType } from "@/types";
import { ZodIssue } from "zod";


// register new admin
export async function registerAdminAction(
  admin: NewAdminType
): Promise<ActionResponseType<string | ZodIssue[]>> {
  try {
    const validationResult = NewAdminSchema.safeParse(admin);
    if (!validationResult.success) {
      return {
        status: "failure",
        message: "request contains errors",
        data: validationResult.error.errors,
      };
    }
    const {confirmPassword,...newAdmin} =admin
    newAdmin.password = await hashPassword(newAdmin.password)
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/register`,
        {method:"POST",
            headers:{
                "content-type":"application/json"
            },
            body:JSON.stringify(newAdmin)
        }
    )
    console.log(response)
    if(!response.ok){
        return {
            status:"failure",
            message:"An error occured",
            data:[{code:"custom",path:["generic"],message:`An error occured, ${response.statusText}`}]
        }
    }
    return await response.json()
  } catch (error) {
    console.log(error)
    return {
        status:"failure",
      
        data:[{code:"custom",path:["generic"],message:`${error && typeof error === "object" && "message" in error ? error.message : "Server error"}`}]
    }
  }
}


//lodin admin
export async function loginAdminAction(
  admin: AdminType
) {
  try {
    const validationResult = AdminSchema.safeParse(admin);
    if (!validationResult.success)  throw new Error(JSON.stringify(validationResult.error.errors))

  
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${API_ROUTES.ADMIN}/login`,
        {method:"POST",
            headers:{
                "content-type":"application/json"
            },
            body:JSON.stringify(admin)
        }
    )
  if(!response.ok) throw new Error(JSON.stringify([{code:"custom",path:["generic"],message:`An error occured, ${response.statusText}`}]))
    return await response.json()
  } catch (error) {
   throw error
  }
}
