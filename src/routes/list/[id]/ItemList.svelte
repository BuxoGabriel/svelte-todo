<script lang="ts">
	import type { Todo } from '$lib/typings';
	import { send, recieve } from './listAnimation';
	import ListItem from './ListItem.svelte';

	export let todos: Todo[];

	let deleting: number[] = [];
    $: visible = todos.filter((td) => !deleting.includes(td.id))

	function updateTodos({ detail }: { detail: { id: number; updatedTodo: Todo }}) {
		todos = todos.map((todo) => (todo.id === detail.id ? detail.updatedTodo : todo));
	}
</script>

<ul class="flex flex-col max-w-md w-full border-black border">
	{#each visible as todo, index (todo.id)}
        <li
        in:send={{key: todo.id}}
        out:recieve={{key: todo.id}}
        style:background-color={index % 2 == 0 ? 'aliceblue' : ''}
        >
            <ListItem {todo} bind:deleting on:update={updateTodos}/>
        </li>
    {/each}
</ul>
