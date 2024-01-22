import { localLists } from '$lib/stores/localList.js'

export const ssr = false

export function load({ params }) {
    const listId: number = parseInt(params.id)
    localLists
    return { listId }
}