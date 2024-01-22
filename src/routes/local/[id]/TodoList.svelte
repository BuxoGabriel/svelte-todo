<script lang="ts">
	import type { Todo } from '$lib/typings';
	import { slide } from 'svelte/transition';
	import TodoItem from './TodoItem.svelte';

	export let todos: Todo[];
</script>

<ul class="flex flex-col max-w-md w-full border-black border">
	{#each todos as todo, index (todo.id)}
        <li
		transition:slide
        style:background-color={index % 2 == 0 ? 'aliceblue' : ''}
        >
            <TodoItem {todo}/>
        </li>
    {/each}
</ul>