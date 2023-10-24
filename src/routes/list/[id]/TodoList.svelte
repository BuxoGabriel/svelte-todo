<script lang="ts">
	import type { Todo } from '$lib/typings';
	import { fly } from 'svelte/transition';
	import { send, recieve } from './listAnimation';
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
        in:fly={{x:200, duration: 200}}
        out:fly={{x:200, duration: 200}}
        style:background-color={index % 2 == 0 ? 'aliceblue' : ''}
        >
            <TodoItem {todo} bind:deleting on:update={updateTodos}/>
        </li>
    {/each}
</ul>
