export type Todo = {
    id: string,
    text: string
}
const todoDatabase = new Map<string, Todo[]>()

export async function addTodo(user: string, todo: string) {
    const todos = todoDatabase.get(user) ?? []
    if(todos.some(td => td.text == todo)) throw new Error("duplicate todo item not allowed")
    todos.push({id: crypto.randomUUID(), text: todo})
    todoDatabase.set(user, todos)
}

export async function deleteTodo(user: string, todoId: string) {
    let todos = todoDatabase.get(user)
    if(!todos) throw new Error("user not found")
    todos = todos.filter(td => td.id !== todoId)
    todoDatabase.set(user, todos)
}

export function getTodos(user: string): Todo[] | undefined {
    return todoDatabase.get(user)
}