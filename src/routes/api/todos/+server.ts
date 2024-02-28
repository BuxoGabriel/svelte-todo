import { getUserTokenFromCookie } from '$lib/auth.js'
import { json, redirect } from '@sveltejs/kit'
import todos from '$lib/database/todos'

export const GET = async({ cookies }) => {
    // Get user from cookie
    const user = getUserTokenFromCookie(cookies)
    if(!user) throw redirect(302, '/login')

    // Return response
    const allTodos = await todos.getAllTodos(user.id)
    return json(allTodos)
}