<script lang="ts">
	import { enhance } from '$app/forms';
	import ErrorMsg from '$lib/components/ErrorMsg.svelte';
	import LeftArr from '$lib/components/LeftArr.svelte';
	import type { Todo } from '$lib/typings.js';
	import TodoList from './TodoList.svelte';

	export let data;
	export let form;
	$: todos = data.todoList;
	let creating = false;

	async function handleCheckboxClicked(e: Event, id: number) {
		const target = e.target as HTMLInputElement;
		if (target.type == 'checkbox') {
			const headers = new Headers();
			headers.append('Content-Type', 'application/json');
			const response = await fetch('/list/api', {
				method: 'PUT',
				headers: headers,
				body: JSON.stringify({ completed: target.checked, id })
			});
			const updatedTodo: Todo = await response.json()
			todos = todos.map(todo => todo.id === updatedTodo.id? updatedTodo: todo)
		}
	}
</script>

<header>
	<button>
		<a href="/list"><LeftArr size={50} /></a>
	</button>
</header>
<main class="flex flex-col items-center pb-8">
	<h1 class="text-2xl capitalize">{data.listName}</h1>
	{#if form?.error}
		<ErrorMsg error={form.error} />
	{/if}

	<form
		class="w-full max-w-md h-10 flex items-center my-4"
		method="POST"
		action="?/create"
		use:enhance={() => {
			creating = true;
			return async ({ update }) => {
				await update();
				creating = false;
			};
		}}
	>
		<label for="text" class="sr-only">Add a todo:</label>
		<input
			disabled={creating}
			placeholder="Add a todo"
			class="grow h-full px-2"
			id="text"
			name="text"
			type="text"
			required
		/>
		<button class="bg-slate-500 text-white px-2 rounded-sm h-full">Add</button>
	</form>
	<TodoList {todos} />
</main>
