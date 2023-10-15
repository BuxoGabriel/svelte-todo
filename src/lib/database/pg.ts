import '$lib/dotenv-config'
import pg from 'pg'

const connectionString = process.env.DATABASE_URL
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

process.on('SIGINT', closePool)
process.on('exit', closePool)

async function closePool() {
    await pool.end()
}