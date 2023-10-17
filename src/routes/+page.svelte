<script lang="ts">
	import { enhance } from '$app/forms';
	import ErrorMsg from '../lib/components/ErrorMsg.svelte';
	export let data;
	export let form;
	let creating = false;
	let deleting: number[] = [];

	async function handleCheckBoxClicked(
		e: Event & { currentTarget: EventTarget & HTMLInputElement },
		todoId: number
	) {
		const checked: boolean = e.currentTarget!.checked;
		const headers = new Headers();
		headers.append('Content-Type', 'application/json');
		await fetch('/todo', {
			method: 'PUT',
			body: JSON.stringify({ checked, todoId }),
			headers: headers
		});
	}
</script>

<header>
	<h1 class="text-xl md:text-2xl capitalize p-4">Hello {data.username}</h1>
</header>
<main class="flex flex-col items-center">
	<h1 class="text-2xl">Your Todos</h1>
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
		<input disabled={creating} placeholder="Add a todo" class="grow h-full px-2" id="text" name="text" type="text" required />
		<button class="bg-slate-500 text-white px-2 rounded-sm h-full">Add</button>
	</form>
	<ul class="flex flex-col max-w-md w-full border-black border">
		{#each data.todoList.filter((td) => !deleting.includes(td.id)) as todo, index (todo.id)}
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
					<label for={"checkbox"+todo.id} class="sr-only">Toggle todo completed</label>
					<input
						id={"checkbox"+todo.id}
						class="w-10"
						type="checkbox"
						checked={todo.completed}
						name="completed"
						on:change={(e) => handleCheckBoxClicked(e, todo.id)}
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
