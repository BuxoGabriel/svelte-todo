import { getUserTokenFromCookie } from '$lib/auth.js';
import lists from '$lib/database/lists'
import { error, redirect } from '@sveltejs/kit';

export async function load({ cookies }) {
    const user = getUserTokenFromCookie(cookies)
    if (!user) throw redirect(302, "/login")
    const userLists = lists.getLists(user.id)
    return { lists: userLists, username: user.username };
};

export const actions = {
    create: async function ({ request, cookies }) {
        // Get User from cookie
        const user = getUserTokenFromCookie(cookies)
        if (!user) throw redirect(302, "/login")
        // Get form data
        const data = await request.formData()
        const name = data.get("name")
        if (!name) throw error(400, new Error("Invalid list name"))
        const list = await lists.addList(user.id, name.toString())
        throw redirect(302, "/list/" + list.id)
    },

    delete: async function ({ request, cookies }) {
        // Get User from cookie
        const user = getUserTokenFromCookie(cookies)
        if (!user) throw redirect(302, "/login")
        // Get form data
        const data = await request.formData()
        const id = data.get("id")
        if (!id || typeof id !== 'string') throw error(400, new Error("Invalid list id"))
        const listId = parseInt(id)
        if (!listId) throw error(400, new Error("invalid list id"))
        await lists.deleteList(user.id, listId)
        return { success: true }
    }
}