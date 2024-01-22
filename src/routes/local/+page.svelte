<script lang="ts">
	import { localLists } from '$lib/stores/localList';

	let newListName: string = ""

</script>
<main class="w-full max-w-sm pb-8 mx-auto">
	<h1 class="text-center text-2xl">Your Todo Lists:</h1>
	<form class="flex flex-col w-full py-2" on:submit|preventDefault={(e) => {localLists.addList(newListName)}}>
		<div class="flex flex-row my-4 h-12 items-center">
			<label for="name" class="px-2 text-2xl">List Name:</label>
			<input class="grow bg-white border border-black h-full px-2" id="name" name="name" type="text" bind:value={newListName}/>
		</div>
		<button class="grow border bg-blue-100 border-black h-10" type="submit">Create List</button>
	</form>
	<ul>
		{#each $localLists as list}
			<li class="flex flex-row border-b border-black pt-4">
				<a data-sveltekit-preload-data="hover" href="/local/{list.id}" class="text-lg grow capitalize">{list.name}</a>
				<button type="submit" class="w-10 h-10" style="background-color: #eeaaa0;" on:click={()=> {
					localLists.deleteList(list.id)
				}}>x</button>
			</li>
		{/each}
	</ul>
</main>