import 'dotenv/config'
import pg from "pg"
import fs from 'fs'

const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
})

await client.connect()
await main().finally(() => client.end())

async function main() {
    const { users, lists, todos } = loadFromFile()

    await client.query('DELETE FROM "User";')

    for (const user of users) {
        await replaceUserInfo(user, lists, todos, client)
    }
}

function loadFromFile() {
    let users = fs.readFileSync('users').toString()
    let lists = fs.readFileSync('lists').toString()
    let todos = fs.readFileSync('todos').toString()

    const res = JSON.parse('{"users":' + users + ',"lists":' + lists + ',"todos":' + todos + '}')

    return res
}

async function replaceUserInfo(user, lists, todos, connection) {
    let { id, username, password, salt, joined } = user
    const userlists = lists.filter(list => list.user == id)
    const userTodos = todos.filter(todo => todo.userId == id)
    const res = await connection.query(
        'INSERT INTO "User"("username", "password", "salt", "joined") VALUES($1, $2, $3, $4) RETURNING *;',
        [username, password, salt, joined]
    )
    const newUser = res.rows[0]
    console.log("Inserted user: " + newUser);
    ({ id, username, password, salt, joined } = newUser);
    for (const list of userlists) {
        await replaceListInfo(id, list, userTodos, connection)
    }
}

async function replaceListInfo(newUserId, list, userTodos, connection) {
    let { id, name } = list
    const listTodos = userTodos.filter(todo => todo.list == id)
    const res = await connection.query('INSERT INTO "List"("user", "name") VALUES($1, $2) RETURNING *;', [newUserId, name])
    const newList = res.rows[0]
    console.log("Inserted list: " + newList);
    ({ id } = newList);
    for (const todo of listTodos) {
        await replaceTodoInfo(newUserId, id, todo, connection)
    }
}

async function replaceTodoInfo(newUserId, newListId, todo, connection) {
    let { text, completed, date } = todo
    const res = await connection.query(
        'INSERT INTO "Todo"("text", "completed", "date", "userId", "list") VALUES($1, $2, $3, $4, $5) RETURNING *;',
        [text, completed, date, newUserId, newListId]
    )
    const newTodo = res.rows[0]
    console.log("Inserted todo: " + newTodo)
}


async function loadFromDb() {
    // Get all Todos (dp on list and user)
    console.log("retrieving todos")
    const todos = (await client.query('SELECT * FROM "Todo"')).rows
    console.log("retrieved todos")
    fs.writeFile("todos", JSON.stringify(todos), () => console.log("Wrote todos to ./todos"))

    // Get all Lists (dp on user)
    console.log("retrieving lists")
    const lists = (await client.query('SELECT * FROM "List"')).rows
    console.log("retrieved lists")
    fs.writeFile("lists", JSON.stringify(lists), () => console.log("Wrote todos to ./lists"))

    // Get all users
    console.log("retrieving users")
    const users = (await client.query('SELECT * FROM "User"')).rows
    console.log("retrieved users")
    fs.writeFile("users", JSON.stringify(users), () => console.log("Wrote users to ./users"))
    return { todos, lists, users }
}