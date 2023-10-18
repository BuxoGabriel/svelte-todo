import { decodeJwt } from '$lib/auth.js'
import todos from '$lib/database/todos'
import lists from '$lib/database/lists'
import { error, fail, redirect } from '@sveltejs/kit'

export async function load({ cookies }) {
    // check user has token
    const token = cookies.get("userToken")
    if (!token) throw redirect(301, "/login")
    // check token is valid
    const userInfo = decodeJwt(token)
    if (!userInfo) throw redirect(301, "/login")
    // see if user has last looked at a list
    const { id, username } = userInfo
    const lastlist = cookies.get("lastList")
    const userLists = await lists.getLists(id)
    let list = userLists[0].id;
    if(lastlist) {
        const lList = parseInt(lastlist)
        if(!isNaN(lList) && userLists.some(todo => todo.id == lList)) list = lList
    }
    const todoList = {id: list, list: await todos.getTodos(list, id) ?? []}
    return { username, todoList, userLists }
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
        //check list is valid
        const list = data.get("list")
        if(!list || typeof list !== 'string') return fail(422, {
            error: "A list must be selected"
        })
        const listId = parseInt(list)
        if(isNaN(listId)) return fail(422, {
            error: "list must be a valid list number"
        })
        //check user exists
        const userToken = cookies.get('userToken')
        if (!userToken) return redirect(303, "/login")
        const user = decodeJwt(userToken)
        if (!user) return redirect(303, '/login')
        try {
            await todos.addTodo(user.id, text, listId)
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
    }
}