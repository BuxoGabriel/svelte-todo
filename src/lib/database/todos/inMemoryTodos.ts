import type { Todo, ITodo } from '$lib/typings'

const todoDatabase = new Map<number, Todo[]>()

const inMemoryTodos: ITodo = {
    addTodo,
    deleteTodo,
    getTodos
}

export default inMemoryTodos

// Function Definitions

async function addTodo(user: number, text: string) {
    let todos = todoDatabase.get(user)
    let id
    if (!todos) {
        id = 1
        todos = []
    } else {
        if (todos.some(td => td.text == text)) throw new Error("duplicate todo item not allowed")
        id = Math.max(...todos.map(td => td.id)) + 1
    }
    const todo: Todo = { id, text, completed: false }
    todos.push(todo)
    todoDatabase.set(user, todos)
    return todo
}

async function deleteTodo(user: number, todoId: number) {
    let todos = todoDatabase.get(user)
    if (!todos) throw new Error("user not found")
    const todo = todos.find(td => td.id == todoId)
    if (!todo) throw new Error("Todo could not be found")
    todos = todos.filter(td => td.id !== todoId)
    todoDatabase.set(user, todos)
    return todo
}

async function getTodos(user: number) {
    return todoDatabase.get(user) ?? []
}

