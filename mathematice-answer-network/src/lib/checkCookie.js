"use server"
import { cookies } from "next/headers"

export async function loginOrNot() {
    const cookieStore = await cookies();
    const loginData = cookieStore.get("login_data");
    if (!loginData) {
        alert("需要登入");
        window.location.href = "/login";
        return;
    } else {
        return loginData.value
    }

}