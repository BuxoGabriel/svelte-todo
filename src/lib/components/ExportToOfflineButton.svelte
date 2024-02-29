<script lang="ts">
	import type { List, Todo } from "$lib/typings";
    import { localLists, localTodos } from "$lib/stores/localList";

    export let lists: List[]
    let loading = false
    let complete = false

    async function handleClick() {
        if(loading || complete) return
        loading = true
        // get todos from db
        let todos: Todo[] = await fetch("/api/todos").then(res => res.json())
        // load todos into a list keyed Map for more efficiency in algorithm
        let todoMap = seperateTodosByList(todos)
        // add todos from db to each list
        for(let list of lists) {
            let listTodos = todoMap.get(list.id)
            // If there are no todos in this list then there is no work to do
            if(!listTodos) continue
            let localList = $localLists.find(l => l.name == list.name)
            // If there is a matching list offline then replace overlapping todos and add missing ones
            if(localList) {
                for(let todo of listTodos) {
                    $localTodos = $localTodos.filter(td => !(td.text == todo.text && td.list == localList!.id))
                    localTodos.addRawTodo(todo.text, localList.id, todo.completed)
                }
            } else { // If this is an online only list create a new list and add all items that belong to it to offline
                let remapedId = localLists.addList(list.name)
                for(let todo of listTodos) {
                    localTodos.addRawTodo(todo.text, remapedId, todo.completed)
                }
            }
        }
        loading = false
        complete = true
    }

    function seperateTodosByList(todos: Todo[]): Map<number, Todo[]> {
        let todoMap: Map<number, Todo[]> = new Map()
        for(let todo of todos) {
            let todoMapVal = todoMap.get(todo.list) || []
            todoMapVal.push(todo)
            todoMap.set(todo.list, todoMapVal)
        }
        return todoMap
    }
</script>

<div>
    <button 
        on:click={handleClick}
        class={!(loading || complete)? "bg-slate-800 hover:bg-slate-500 hover:translate-x-1 hover:translate-y-1 button-shadow": "bg-slate-500 translate-x-1 translate-y-1"}
        class:complete
    >
        Export to Offline
    </button>
</div>

<style>
    .button-shadow {
        box-shadow: 0.25rem 0.25rem 0 0 rgb(100 116 139);
    }
    .button-shadow:hover {
        box-shadow: none;
    }
	button {
        @apply w-32 h-16 m-4 text-white border rounded-xl;
	}
    .complete {
        @apply bg-green-500;
    }
</style>