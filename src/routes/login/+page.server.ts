import { createJwt, validateCredentials } from '$lib/auth.js'
import { fail, redirect } from '@sveltejs/kit'

export const actions = {
    default: async ({ request, cookies }) => {
        const data = await request.formData()
        const username = data.get('username')
        const password = data.get('password')
        // validate input
        if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
            return fail(422, {
                username,
                error: 'invalid username or password'
            })
        }
        // check if user exists
        if (!validateCredentials(username, password)) {
            return fail(422, {
                username,
                error: 'username and or password is incorrect'
            })
        }
        // set cookie
        const token = createJwt(username)
        cookies.set('userToken', token)
        // redirect to app
        throw redirect(303, "/")
    }
}