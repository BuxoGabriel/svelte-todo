<script lang="ts">
	import type { List, Todo } from "$lib/typings";
    import { localLists, localTodos } from "$lib/stores/localList";

    export let lists: List[]
    let loading = false
    let complete = false

    async function handleClick() {
        if(loading || complete) return
        loading = true
        let todos: Todo[] = await fetch("/api/todos").then(res => res.json())
        let todoMap = seperateTodosByList(todos)
        for(let list of lists) {
            if($localLists.some(l => l.name == list.name)) continue; //TODO deal with merges on existing lists
            let remapedId = localLists.addList(list.name)
            let listTodos = todoMap.get(list.id) || []
            for(let todo of listTodos) {
                localTodos.addRawTodo(todo.text, remapedId, todo.completed)
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