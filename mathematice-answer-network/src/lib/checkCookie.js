"use server"
import { redirect } from 'next/navigation'

import { getSessionUser } from "./auth"

export async function loginOrNot() {
    const user = await getSessionUser();
    if (!user) {
        // alert("需要登入");
        redirect("/login")
        
    }
    return user.uid
}
