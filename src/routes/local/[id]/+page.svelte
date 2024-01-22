<script lang="ts">
	import LeftArr from '$lib/components/LeftArr.svelte';
	import TodoList from './TodoList.svelte';
	import { localLists, localTodos } from "$lib/stores/localList.js"

	export let data;
	let listName: string = $localLists.find(list => list.id == data.listId)!.name
	let newTodoName: string = ""
	$:todos = $localTodos.filter(todo => todo.list == data.listId)
</script>

<header>
	<button>
		<a href="/local"><LeftArr size={"50px"} /></a>
	</button>
</header>
<main class="flex flex-col items-center pb-8">
	<h1 class="text-2xl capitalize">{listName}</h1>

	<form class="w-full max-w-md h-10 flex items-center my-4" on:submit|preventDefault={e => {
		localTodos.addTodo(newTodoName, data.listId)
	}}>
		<label for="text" class="sr-only">Add a todo:</label>
		<input
			placeholder="Add a todo"
			class="grow h-full px-2"
			id="text"
			name="text"
			type="text"
			bind:value={newTodoName}
		/>
		<button class="bg-slate-500 text-white px-2 rounded-sm h-full">Add</button>
	</form>
	<TodoList {todos}/>
</main>
