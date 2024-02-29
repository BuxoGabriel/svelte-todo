import { DATABASE_URL } from '$env/static/private'
import pg from 'pg'

const connectionString = DATABASE_URL
console.log(connectionString)

const pool = new pg.Pool({
    connectionString,
    max: 10,
})

// can throw error
export async function useClient<T>(fn: (c:pg.PoolClient) => Promise<T>): Promise<T> {
    const client = await pool.connect()
    const res = await fn(client)
    await client.release()
    return res
}

export async function makeQuery<T>(query: string, args: (string | number | boolean)[]): Promise<T[]> {
    return useClient(async (c) => {
        const res = await c.query(query, args)
        return res.rows as T[]
    })
}

export async function makeOneRowQuery<T>(query: string, args: (string | number | boolean)[]): Promise<T> {
    return useClient(async (c) => {
        const res = await c.query(query, args)
        return res.rows[0] as T
    })
}

process.on('SIGINT', closePool)
process.on('exit', closePool)

async function closePool() {
    await pool.end()
}