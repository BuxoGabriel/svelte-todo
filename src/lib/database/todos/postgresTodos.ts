import type { Todo, ITodo, List } from "$lib/typings";
import { useClient } from "../pg";

const posgresTodos: ITodo = {
    addTodo,
    deleteTodo,
    getTodos,
    setTodoDone,
    getLists,
    addList
}

export default posgresTodos

async function addTodo(user: number, todo: string, list: number): Promise<Todo> {
    return useClient(async (pc) => {
        const res = await pc.query('INSERT INTO "Todo"("userId", text, list) values ($1, $2, $3)', [user, todo, list])
        return res.rows[0] as Todo
    })
}

async function deleteTodo(user: number, todoId: number): Promise<Todo> {
    return useClient(async (pc) => {
        const res = await pc.query('DELETE FROM "Todo" WHERE id=$1 AND "userId"=$2', [todoId, user])
        return res.rows[0] as Todo
    })
}

async function getTodos(list: number, user: number): Promise<Todo[]> {
    return await useClient(async (pc) => {
        const res = await pc.query('SELECT * FROM "Todo" WHERE "list"=$1 AND "userId"=$2 ORDER BY date asc', [list, user])
        return res.rows
    })
}

async function setTodoDone(user: number, todoid: number, completed: boolean): Promise<Todo> {
    return await useClient(async (pc) => {
        const res = await pc.query('UPDATE "Todo" SET completed=$1 WHERE "userId"=$2 AND id=$3 RETURNING *;', [completed, user, todoid])
        return res.rows[0] as Todo
    })
}

async function getLists(user: number): Promise<List[]> {
    return await useClient(async (pc) => {
        const res = await pc.query('SELECT * FROM "List" WHERE "user"=$1;', [user])
        return res.rows
    })
}

async function addList(user: number, name: string): Promise<List> {
    return await useClient(async (pc) => {
        const res = await pc.query('INSERT INTO "List"(user, name) VALUES ($1, $2) RETURNING *;', [user, name])
        return res.rows[0] as List
    })
}