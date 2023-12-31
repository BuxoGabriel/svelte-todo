import users from '$lib/database/users'
import { createJwt } from '$lib/auth.js'
import { fail, redirect } from '@sveltejs/kit'

export const actions = {
    default: async ({ request, cookies }) => {
        const data = await request.formData()
        let username = data.get('username')
        const password = data.get('password')
        // validate input
        if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
            return fail(422, {
                username,
                error: 'invalid username or password'
            })
        }
        username = username.toLowerCase()
        // check if user exists
        try {
            const user = await users.authenticateUser(username, password)
            // set cookie
            const token = createJwt({id: user.id, username: user.username})
            cookies.set('userToken', token)
        } catch(error) {
            return fail(422, {
                username,
                error: (error as Error).message
            })
        }
        // redirect to app
        throw redirect(303, "/")
    }
}