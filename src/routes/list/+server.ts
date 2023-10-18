import { decodeJwt } from "$lib/auth";
import { fail, redirect, type RequestHandler } from "@sveltejs/kit";
import lists from "$lib/database/lists"

export const POST: RequestHandler = async ({ cookies, request }) => {
    // Get User
    const token = cookies.get("userToken")
    if (!token) throw redirect(301, "/login")
    const userInfo = decodeJwt(token)
    if (!userInfo) throw redirect(301, "/login")
    const { id: userId } = userInfo
    // Get list from request
    const { name } = await request.json()
    // Create List
    try {
        const list = lists.addList(userId, name)
        return new Response(JSON.stringify(list), { status: 200});
    } catch(error) {
        throw fail(500, { error: "Could not create new list"})
    }
};