<script lang="ts">
	import { localTodos } from '$lib/stores/localList';
	import type { Todo } from '$lib/typings';

	export let todo: Todo;
	let completed = todo.completed;

	const debounceTime = 1000;
	let timeout: NodeJS.Timeout | undefined = undefined;

	function handleCheckboxClicked(e: Event, id: number) {
		// restart debounce
		clearTimeout(timeout);

		// verify dom element type is checkbox
		const target = e.target as HTMLInputElement;
		if (target.type !== 'checkbox') return;

		// Don't do anything if no change
		if (target.checked == completed) return;
		timeout = setTimeout(async () => {
			localTodos.setTodoDone(id, target.checked)
		}, debounceTime);
	}
</script>

<form class="flex items-center" on:submit|preventDefault>
	<label for={'checkbox' + todo.id} class="sr-only">Toggle todo completed</label>
	<input
		id={'checkbox' + todo.id}
		class="w-10 h-10"
		type="checkbox"
		bind:checked={completed}
		name="completed"
		on:click={(e) => handleCheckboxClicked(e, todo.id)}
	/>
	<span class:line-through={completed} class="grow px-2 capitalize decoration-black/80">{todo.text}</span>
	<button class="w-10 h-10" style="background-color: #eeaaa0;" on:click={() => {
		localTodos.deleteTodo(todo.id)
	}}>X</button>
</form>
