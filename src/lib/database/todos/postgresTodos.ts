import type { Todo, ITodo } from "$lib/typings";
import { useClient } from "../pg";

const posgresTodos: ITodo = {
    addTodo,
    deleteTodo,
    getTodos
}

export default posgresTodos

async function addTodo(user: number, todo: string): Promise<Todo> {
    return useClient(async (pc) => {
        const res = await pc.query('INSERT INTO "Todo"("userId", text) values ($1, $2)', [user, todo])
        const todoItem = res.rows[0]
        return todoItem as Todo
    })
}

async function deleteTodo(user: number, todoId: number): Promise<Todo> {
    return useClient(async (pc) => {
        const res = await pc.query('DELETE FROM "Todo" WHERE id=$1 AND "userId"=$2', [user, todoId])
        const todoItem = res.rows[0]
        return todoItem as Todo
    })
}

async function getTodos(user: number): Promise<Todo[]> {
    return await useClient(async (pc) => {
        const res = await pc.query('SELECT * FROM "Todo" WHERE "userId"=$1', [user])
        return res.rows
    })
}