<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';
	import { loggedIn } from '$lib/stores/login';
	import ExportToOfflineButton from '$lib/components/ExportToOfflineButton.svelte';

	export let data: PageData;
	let newListName: string = ""
	$loggedIn = true
</script>

<header>
	<div class="flex flex-row w-full">
		<h1 class="text-2xl md:text-2xl capitalize p-4 grow">Hello {data.username}</h1>
		<ExportToOfflineButton lists={data.lists}/>
	</div>
</header>
<main class="w-full max-w-sm pb-8 mx-auto">
	<h1 class="text-center text-2xl">Your Todo Lists:</h1>
	<form class="flex flex-col w-full py-2" method="POST" action="?/create" use:enhance={() => {
		newListName = ""
	}}>
		<div class="flex flex-row my-4 h-12 items-center">
			<label for="name" class="px-2 text-2xl">List Name:</label>
			<input class="grow bg-white border border-black h-full px-2" id="name" name="name" type="text" bind:value={newListName} />
		</div>
		<button class="grow border bg-blue-100 border-black h-10" type="submit">Create List</button>
	</form>
	<ul>
		{#each data.lists as list}
			<li class="flex flex-row border-b border-black pt-4">
				<a data-sveltekit-preload-data="hover" href="/list/{list.id}" class="text-lg grow capitalize">{list.name}</a>
				<form method="POST" action="?/delete">
					<input type="hidden" name="id" value={list.id} />
					<button type="submit" class="w-10 h-10" style="background-color: #eeaaa0;">x</button>
				</form>
			</li>
		{/each}
	</ul>
</main>