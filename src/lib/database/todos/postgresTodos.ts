import type { Todo, ITodo } from "$lib/typings";
import { useClient } from "../pg";

const posgresTodos: ITodo = {
    addTodo,
    deleteTodo,
    getTodos,
    setTodoDone
}

export default posgresTodos

async function addTodo(user: number, todo: string): Promise<Todo> {
    return useClient(async (pc) => {
        const res = await pc.query('INSERT INTO "Todo"("userId", text) values ($1, $2)', [user, todo])
        return res.rows[0] as Todo
    })
}

async function deleteTodo(user: number, todoId: number): Promise<Todo> {
    return useClient(async (pc) => {
        const res = await pc.query('DELETE FROM "Todo" WHERE id=$1 AND "userId"=$2', [todoId, user])
        return res.rows[0] as Todo
    })
}

async function getTodos(user: number): Promise<Todo[]> {
    return await useClient(async (pc) => {
        const res = await pc.query('SELECT * FROM "Todo" WHERE "userId"=$1 ORDER BY date asc', [user])
        return res.rows
    })
}

async function setTodoDone(user: number, todoid: number, completed: boolean): Promise<Todo> {
    return await useClient(async (pc) => {
        const res = await pc.query('UPDATE "Todo" SET completed=$1 WHERE "userId"=$2 AND id=$3 RETURNING *;', [completed, user, todoid])
        return res.rows[0] as Todo
    })
}