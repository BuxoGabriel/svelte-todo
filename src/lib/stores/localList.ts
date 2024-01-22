import { writable } from "svelte/store";
import { browser } from "$app/environment";
import type { List, Todo } from "$lib/typings";

function getLocalLists(): List[] {
    if (!browser || !localStorage) return []
    const localLists = localStorage.getItem("lists")
    if (!localLists) return []
    try {
        return JSON.parse(localLists)
    }
    catch {
        localStorage.set("lists", "[]")
        return []
    }
}

function setLocalLists(lists: List[]): void {
    if (!browser || !localStorage) return
    localStorage.setItem("lists", JSON.stringify(lists))
}

function getLocalTodos(): Todo[] {
    if (!browser || !localStorage) return []
    const localTodos = localStorage.getItem("todos")
    if (!localTodos) return []
    try {
        return JSON.parse(localTodos)
    } catch (error) {
        localStorage.setItem("todos", "[]")
        return []
    }
}

function setLocalTodos(todos: Todo[]): void {
    if (!browser || !localStorage) return
    localStorage.setItem("todos", JSON.stringify(todos))
}

const listStore = writable<List[]>(getLocalLists())
const todosStore = writable<Todo[]>(getLocalTodos())

export const localLists = {
    subscribe: listStore.subscribe,
    addList: (listName: string) => {
        listStore.update(lists => {
            let id = 0
            lists.forEach(list => {
                if (list.id > id) id = list.id
            })
            id++
            const updatedLists: List[] = [...lists, { name: listName, id }]
            setLocalLists(updatedLists)
            return updatedLists
        })
    },
    deleteList: (listId: number) => {
        // delete list from localstorage
        listStore.update(lists => {
            const updatedLists = lists.filter(list => list.id !== listId)
            setLocalLists(updatedLists)
            return updatedLists
        })
        // delete todos in that list from localstorage
        todosStore.update(todos => {
            const updatedTodos = todos.filter(todo => todo.list !== listId)
            setLocalTodos(updatedTodos)
            return updatedTodos
        })
    }
}

export const localTodos = {
    subscribe: todosStore.subscribe,
    addTodo: (text: string, list: number) => {
        todosStore.update(todos => {
            let id = 0
            todos.forEach(todo => {
                if (todo.id > id) id = todo.id
            })
            id++
            const updatedTodos: Todo[] = [...todos, { id, text, completed: false, list }]
            setLocalTodos(updatedTodos)
            return updatedTodos
        })
    },
    deleteTodo: (todoId: number) => {
        todosStore.update(todos => {
            const updatedTodos = todos.filter(todo => todo.id !== todoId)
            setLocalTodos(updatedTodos)
            return todos
        })
    },
    setTodoDone: (todoId: number, completed: boolean) => {
        todosStore.update(todos => {
            const updatedTodos = todos.map(todo => {
                if (todo.id == todoId) todo.completed = completed
                return todo
            })
            setLocalTodos(updatedTodos)
            return updatedTodos
        })
    }
}