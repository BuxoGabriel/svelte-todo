import { decodeJwt } from '$lib/auth.js'
import { addTodo, deleteTodo, getTodos } from '$lib/database/todos.js'
import { error, fail, redirect } from '@sveltejs/kit'

export async function load({ cookies }) {
    const token = cookies.get("userToken")
    if (!token) throw redirect(301, "/login")
    const user = decodeJwt(token)
    if (!user) throw redirect(301, "/login")
    const todos = getTodos(user) ?? []
    return { user, todos }
}

export const actions = {
    create: async ({ request, cookies }) => {
        const data = await request.formData()
        // check form data is valid
        const text = data.get('text')
        if (!text || typeof text !== 'string') return fail(422, {
            text,
            error: 'text can not be empty'
        })
        //check user exists
        const userToken = cookies.get('userToken')
        if (!userToken) return redirect(303, "/login")
        const user = decodeJwt(userToken)
        if (!user) return redirect(303, '/login')
        try {
            await addTodo(user, text)
        } catch (error) {
            return fail(400, {
                text, error: (error as Error).message
            })
        }
    },

    delete: async ({ cookies, request }) => {
        const data = await request.formData()
        const id = data.get('id')
        if (!id || typeof id !== 'string') throw error(400, "bad value of todo id")
        const userToken = cookies.get('userToken')
        if (!userToken || typeof userToken !== 'string') throw redirect(303, "/login")
        const user = decodeJwt(userToken)
        if (!user) throw redirect(303, "/login")
        try {
            await deleteTodo(user, id)
            return { success: true }
        } catch (error) {
            return fail(400, {
                error: "todo could not be deleted"
            })
        }
    }
}