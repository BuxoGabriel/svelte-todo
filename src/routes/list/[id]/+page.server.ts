import { getUserTokenFromCookie } from '$lib/auth.js'
import todos from '$lib/database/todos'
import { error, fail, redirect } from '@sveltejs/kit'

export async function load({ cookies, params }) {
    // Get User from cookie
    const userInfo = getUserTokenFromCookie(cookies)
    if (!userInfo) throw redirect(301, "/login")
    const { username, id } = userInfo

    // Get list from url
    const listId = parseInt(params.id)
    if(isNaN(listId)) throw error(404, "Invalid List")
    const todoList = await todos.getTodos(listId, id) ?? []

    // TODO
    const listName = "Todo List"
    return { username, todoList, listName }
}

export const actions = {
    create: async ({ request, cookies, params }) => {
        // Get user from cookie
        const user = getUserTokenFromCookie(cookies)
        if(!user) throw redirect(303, '/login')
        const data = await request.formData()

        // check form data is valid
        const text = data.get('text')
        if (!text || typeof text !== 'string') return fail(422, {
            text,
            error: 'text can not be empty'
        })

        //check list is valid
        const list = params.id
        const listId = parseInt(list)
        if(isNaN(listId)) return fail(422, {
            error: "list must be a valid list number"
        })

        // Try adding todo to list
        try {
            const todo = await todos.addTodo(user.id, text, listId)
            return {newTodo: todo}
        } catch (error) {
            return fail(400, {
                text, error: (error as Error).message
            })
        }
    },

    delete: async ({ cookies, request }) => {
        // Get User
        const user = getUserTokenFromCookie(cookies)
        if(!user) throw redirect(303, '/login')
        // Get Form Data
        const data = await request.formData()
        const id = data.get('id')
        if (!id || typeof id !== 'string') throw error(400, "bad value of todo id")
        const todoId = parseInt(id)
        if(isNaN(todoId)) throw error(400, "bad value of todo id")
        try {
            await todos.deleteTodo(user.id, todoId)
            return { success: true }
        } catch (error) {
            return fail(400, {
                error: "todo could not be deleted"
            })
        }
    },

    update: async ({ cookies, request, params }) => {
        // Get User from cookie
        const user = getUserTokenFromCookie(cookies)
        if(!user) throw redirect(303, '/login')

        // Get id from params
        const id = params.id
        const todoId = parseInt(id)
        if(isNaN(todoId)) throw error(400, "bad value of todo id")
        
        // Load form data
        const data = await request.formData()
        // Get completed from form
        const completed = data.get("completed")
        if (!completed || typeof completed !== 'string') throw error(400, "bad value for completed")
        const done = completed == "true"

        // update todo with done value
        todos.setTodoDone(user.id, todoId, done)
    }
}