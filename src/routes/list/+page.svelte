<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	export let data: PageData;
</script>
<header>
	<h1 class="text-2xl md:text-2xl capitalize p-4">Hello {data.username}</h1>
</header>
<main class="w-full max-w-sm pb-8 mx-auto">
	<h1 class="text-center text-2xl">Your Todo Lists:</h1>
	<form class="flex flex-col w-full py-2" method="POST" action="?/create" use:enhance>
		<div class="flex flex-row my-4 h-12 items-center">
			<label for="name" class="px-2 text-2xl">List Name:</label>
			<input class="grow bg-white border border-black h-full px-2" id="name" name="name" type="text" />
		</div>
		<button class="grow border bg-blue-100 border-black h-10" type="submit">Create List</button>
	</form>
	<ul>
		{#each data.lists as list}
			<li class="flex flex-row border-b border-black pt-4">
				<a href="/list/{list.id}" class="text-lg grow capitalize">{list.name}</a>
				<form method="POST" action="?/delete">
					<input type="hidden" name="id" value={list.id} />
					<button type="submit" class="w-10 h-10" style="background-color: #eeaaa0;">x</button>
				</form>
			</li>
		{/each}
	</ul>
</main>