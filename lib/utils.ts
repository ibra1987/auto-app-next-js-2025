import { ZodSchema } from "zod"




export const inputValidtor =(data:Record<string,any>,schema:ZodSchema)=>{
     
    const validationResult = schema.safeParse(data)
    if(!validationResult.success){
        return validationResult.error.errors
    }
    return null
}

