export type Todo = {
    id: number,
    text: string,
    completed: boolean
}

export type User = {
    id: number,
    username: string
}

export interface ITodo {
    addTodo(user: number, todo: string): Promise<Todo>,
    deleteTodo(user: number, todoid: number): Promise<Todo>
    getTodos(user: number): Promise<Todo[]>
}

export interface IUser {
    authenticateUser(username: string, password: string): Promise<User>,
    createUser(username: string, password: string): Promise<User>,
}