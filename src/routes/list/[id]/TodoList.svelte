<script lang="ts">
	import type { Todo } from '$lib/typings';
	import { slide } from 'svelte/transition';
	import TodoItem from './TodoItem.svelte';

	export let todos: Todo[];

	let deleting: number[] = [];
    $: visible = todos.filter((td) => !deleting.includes(td.id))

	function updateTodos({ detail }: { detail: { id: number; updatedTodo: Todo }}) {
		todos = todos.map((todo) => (todo.id === detail.id ? detail.updatedTodo : todo))
	}
</script>

<ul class="flex flex-col max-w-md w-full border-black border">
	{#each visible as todo, index (todo.id)}
        <li
		transition:slide
        style:background-color={index % 2 == 0 ? 'aliceblue' : ''}
        >
            <TodoItem {todo} bind:deleting on:update={updateTodos}/>
        </li>
    {/each}
</ul>
