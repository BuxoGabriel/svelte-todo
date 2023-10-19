import { getUserTokenFromCookie } from '$lib/auth.js'
import { json, redirect } from '@sveltejs/kit'
import todos from '$lib/database/todos'

export const PUT = async({ request, cookies }) => {
    // Get user from cookie
    const user = getUserTokenFromCookie(cookies)
    if(!user) throw redirect(302, '/login')

    // Get data from request
    const { id, completed }: {id: number, completed: boolean} = await request.json()
    
    // Return response
    const newTodo = await todos.setTodoDone(user.id, id, completed)
    return json(newTodo)
}