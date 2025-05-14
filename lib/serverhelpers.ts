"use server"

import bcrypt from "bcryptjs"



export async function hashPassword(password:string){
    return await bcrypt.hash(password,10)

}

export async function comparePassword(pass:string,hashedPass:string) {
    
    return bcrypt.compare(pass,hashedPass)
}