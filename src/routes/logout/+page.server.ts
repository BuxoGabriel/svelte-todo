import { redirect } from '@sveltejs/kit'

export async function load({ cookies }) {
    cookies.delete('userToken')
    throw redirect(301, '/login')
}