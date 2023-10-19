import { getUserTokenFromCookie } from '$lib/auth.js';
import { redirect } from '@sveltejs/kit';

export function load({cookies}) {
    const user = getUserTokenFromCookie(cookies)
    if(!user) throw redirect(302, "/login")
    throw redirect(302, "/list")
}