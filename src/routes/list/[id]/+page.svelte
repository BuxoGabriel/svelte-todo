<script lang="ts">
	import { enhance } from '$app/forms';
	import ErrorMsg from '$lib/components/ErrorMsg.svelte';
	import LeftArr from '$lib/components/LeftArr.svelte';
	import type { Todo } from '$lib/typings.js';

	export let data;
	export let form;
	let todos = data.todoList;
	let creating = false;
	let deleting: number[] = [];

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
	<h1 class="text-xl md:text-2xl capitalize p-4">Hello {data.username}</h1>
</header>
<main class="flex flex-col items-center pb-8">
	<h1>{data.listName}</h1>
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
	<ul class="flex flex-col max-w-md w-full border-black border">
		{#each todos.filter((td) => !deleting.includes(td.id)) as todo (todo.id)}
			<li>
				<form
					class="flex"
					method="POST"
					action="?/delete"
					use:enhance={() => {
						deleting = [...deleting, todo.id];
						return async ({ update }) => {
							await update();
							deleting = deleting.filter((id) => id !== todo.id);
						};
					}}
				>
					<label for={'checkbox' + todo.id} class="sr-only">Toggle todo completed</label>
					<input
						id={'checkbox' + todo.id}
						class="w-10"
						type="checkbox"
						checked={todo.completed}
						name="completed"
						on:click={(e) => handleCheckboxClicked(e, todo.id)}
					/>
					<input type="hidden" name="id" value={todo.id} />
					<span class="grow px-2 capitalize">{todo.text}</span>
					<button class="w-10 h-10" style="background-color: #eeaaa0;" type="submit">X</button>
				</form>
			</li>
		{/each}
	</ul>
</main>

<style>
	li:nth-child(even) {
		background-color: aliceblue;
	}
</style>
