<script lang="ts">
	import { enhance } from '$app/forms';
	import ErrorMsg from '../components/ErrorMsg.svelte';
	export let data;
	export let form;
	let creating = false;
	let deleting: number[] = [];

	async function handleCheckBoxClicked(e: Event & { currentTarget: EventTarget & HTMLInputElement; }, todoId: number) {
		const checked: boolean = e.currentTarget!.checked
		const headers = new Headers()
		headers.append('Content-Type', 'application/json')
		await fetch("/todo", {
			method: "PUT",
			body: JSON.stringify({checked, todoId}),
			headers: headers
		})
	}

</script>

<header>
	<h1>Hi {data.username}</h1>
</header>
<main>
	<h2>Your Todos</h2>
	{#if form?.error}
		<ErrorMsg error={form.error} />
	{/if}

	<form method="POST" action="?/create" use:enhance={() => {
		creating = true
		return async ({ update }) => {
			await update()
			creating = false
		}
	}}>
		<label
			>add a todo:
			<input disabled={creating} id="text" name="text" type="text" required />
		</label>
	</form>
	<ul>
		{#each data.todoList.filter(td => !deleting.includes(td.id)) as todo, index (todo.id)}
			<li>
				<form method="POST" action="?/delete" use:enhance={() => {
					deleting = [...deleting, todo.id]
					return async({ update }) => {
						await update()
						deleting = deleting.filter(id => id !== todo.id)
					}
				}}>
					<input type="checkbox" checked={todo.completed} name="completed" 
						on:change={(e) => handleCheckBoxClicked(e, todo.id)}/>
					<input type="hidden" name="id" value={todo.id} />
					<span>{index + 1}. {todo.text}</span>
					<button style="background-color: #eeaaa0;" type="submit">X</button>
				</form>
			</li>
		{/each}
	</ul>
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	ul {
		display: flex;
		flex-direction: column;
		width: 30rem;
		max-width: 90vw;
		border: 2px solid black;
	}

	li {
		list-style-type: none;
		width: 100%;
	}

	li > form {
		display: flex;
		justify-content: space-between;
	}

	li:nth-child(even) {
		background-color: aliceblue;
	}
</style>
