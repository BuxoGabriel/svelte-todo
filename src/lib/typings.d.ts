export type Todo = {
    id: number,
    text: string,
    completed: boolean
}

export type User = {
    id: number,
    username: string
}

export type List = {
    id: number,
    name: string,
    user: number
}

export interface ITodo {
    addTodo(user: number, todo: string, list: number): Promise<Todo>,
    deleteTodo(user: number, todoid: number): Promise<Todo>
    getTodos(list: number, user: number): Promise<Todo[]>
    setTodoDone(user: number, todoid: number, completed: boolean): Promise<Todo>
    getLists(user: number): Promise<List[]>
    addList(user: number, name: string): Promise<List>
}

export interface IUser {
    authenticateUser(username: string, password: string): Promise<User>,
    createUser(username: string, password: string): Promise<User>,
}