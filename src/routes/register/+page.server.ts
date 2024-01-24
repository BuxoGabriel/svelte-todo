import users from '$lib/database/users'
import { createJwt } from '$lib/auth.js'
import { fail, redirect } from '@sveltejs/kit'
import { USER_COOKIE_DURATION } from '$env/static/private'

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
        // check if creating user succeeds
        try {
            const user = await users.createUser(username, password)
            // set cookie
            const token = createJwt({ id: user.id, username: user.username })
            // cookies persist for 50 days
            cookies.set('userToken', token, { maxAge: 60 * 60 * 24 * parseInt(USER_COOKIE_DURATION)})
        } catch (error) {
            return fail(422, {
                username,
                error: "Could not create user. Try a different username."
            })
        }
        // redirect to app
        throw redirect(303, "/list")
    }
}