<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Todo } from '$lib/typings';
	import { createEventDispatcher } from 'svelte';

	export let deleting: number[];
	export let todo: Todo;
	let completed = todo.completed;

	const dispach = createEventDispatcher();

	const debounceTime = 1250;
	let timeout: NodeJS.Timeout | undefined = undefined;

	function handleCheckboxClicked(e: Event, id: number) {
		// restart debounce
		clearTimeout(timeout);

		// verify dom element type is checkbox
		const target = e.target as HTMLInputElement;
		if (target.type !== 'checkbox') return;

		// Don't send API call if it is same as it arrived
		if (target.checked == completed) return;
		timeout = setTimeout(async () => {
			const headers = new Headers();
			headers.append('Content-Type', 'application/json');
			const response = await fetch('/list/api', {
				method: 'PUT',
				headers: headers,
				body: JSON.stringify({ completed: target.checked, id })
			});

			// update todos from response
			const updatedTodo: Todo = await response.json();
			dispach('update', { id, updatedTodo });
		}, debounceTime);
	}
</script>

<li 
    >
	<form
		class="flex items-center"
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
			class="w-10 h-10"
			type="checkbox"
			bind:checked={completed}
			name="completed"
			on:click={(e) => handleCheckboxClicked(e, todo.id)}
		/>
		<input type="hidden" name="id" value={todo.id} />
		<span class:line-through={completed} class="grow px-2 capitalize decoration-black/80"
			>{todo.text}</span
		>
		<button class="w-10 h-10" style="background-color: #eeaaa0;" type="submit">X</button>
	</form>
</li>
