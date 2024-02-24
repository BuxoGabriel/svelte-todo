import 'dotenv/config'
import pg from "pg"

console.log(process.env.DATABASE_URL)
const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
})

await client.connect();
await main().finally(() => client.end());

async function main() {
    let users = await client.query("select * from users");
    console.log(users.rows)
}