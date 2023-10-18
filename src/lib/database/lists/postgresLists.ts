import '$lib/dotenv-config'
import { useClient } from "$lib/database/pg"
import type { IList, List } from "$lib/typings"

const postgresLists: IList = {
    getLists,
    addList,
    deleteList
}

export default postgresLists

async function getLists(user: number): Promise<List[]> {
    return await useClient(async (pc) => {
        const res = await pc.query('SELECT * FROM "List" WHERE "user"=$1;', [user])
        return res.rows
    })
}

async function addList(user: number, name: string): Promise<List> {
    return await useClient(async (pc) => {
        const res = await pc.query('INSERT INTO "List"("user", "name") VALUES($1, $2) RETURNING *;', [user, name])
        return res.rows[0] as List
    })
}

async function deleteList(user: number, id: number): Promise<List> {
    return await useClient(async (pc) => {
        const res = await pc.query('DELETE FROM "List" WHERE "user"=$1 AND "id"=$2 RETURNING *', [user, id])
        return res.rows[0] as List
    })
}