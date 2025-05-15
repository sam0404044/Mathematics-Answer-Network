"use server"
import { redirect } from 'next/navigation'

import { cookies } from "next/headers"

export async function loginOrNot() {
    const cookieStore = await cookies();
    const loginData = cookieStore.get("login_data");
    if (!loginData) {
        // alert("需要登入");
        redirect("/login")
        
    } else {
        return loginData.value
    }

}