import todos from "$lib/database/todos"
import { decodeJwt } from '$lib/auth';
import { fail, redirect, type RequestHandler } from '@sveltejs/kit';

export const PUT: RequestHandler = async ({ request, cookies }) => {
    // Get User
    const token = cookies.get("userToken")
    if (!token) throw redirect(301, "/login")
    const userInfo = decodeJwt(token)
    if (!userInfo) throw redirect(301, "/login")
    const { id: userId } = userInfo
    // Update Database
    const { todoId, checked } = await request.json()
    try {
        const newTodo = await todos.setTodoDone(userId, todoId, checked)
        return new Response(JSON.stringify(newTodo), { status: 200 });
    } catch (error) {
        console.error(error)
        throw fail(400, { error: "could not set todo completed" })
    }
};