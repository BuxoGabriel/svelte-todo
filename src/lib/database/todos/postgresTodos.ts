import '$lib/dotenv-config'
import type { Todo, ITodo} from "$lib/typings";
import { makeOneRowQuery, makeQuery } from "../pg";

const posgresTodos: ITodo = {
    addTodo,
    deleteTodo,
    getTodos,
    getAllTodos,
    setTodoDone
}

export default posgresTodos

async function addTodo(user: number, todo: string, list: number): Promise<Todo> {
    return makeOneRowQuery('INSERT INTO "Todo"("userId", text, list) values ($1, $2, $3)', [user, todo, list])
}

async function deleteTodo(user: number, todoId: number): Promise<Todo> {
    return makeOneRowQuery('DELETE FROM "Todo" WHERE id=$1 AND "userId"=$2', [todoId, user])
}

async function getTodos(list: number, user: number): Promise<Todo[]> {
    return makeQuery('SELECT * FROM "Todo" WHERE "list"=$1 AND "userId"=$2 ORDER BY date asc', [list, user])
}

async function getAllTodos(user: number): Promise<Todo[]> {
    return makeQuery('SELECT * FROM "Todo" WHERE "userId"=$1 ORDER BY date asc', [user])
}

async function setTodoDone(user: number, todoId: number, completed: boolean): Promise<Todo> {
    return makeOneRowQuery('UPDATE "Todo" SET completed=$1 WHERE "userId"=$2 AND id=$3 RETURNING *;', [completed, user, todoId])
}
