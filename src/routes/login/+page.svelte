<script lang="ts">
	export let form;
	import { enhance } from '$app/forms';
	import ErrorMsg from '$lib/components/ErrorMsg.svelte';
	import { loggedIn } from "$lib/stores/login";

	$loggedIn = false
</script>

<div class="flex flex-col items-center justify-center my-6">
	<h1 class="text-center text-4xl">Login</h1>
	<form class="flex flex-col gap-4 my-8 border rounded-md px-2 pt-2 pb-8 border-slate-400" method="POST" use:enhance>
		<label class="text-lg"
			>Username:
			<!-- svelte-ignore a11y-autofocus -->
			<input
				id="username"
                class="w-full"
				type="username"
				name="username"
				value={form?.username ?? ''}
				required
				autofocus
			/>
		</label>

		<label class="text-lg"
			>Password:
			<input
				id="password"
                class="w-full"
				type="password"
				name="password"
				required
			/>
		</label>
		<button class="border border-black" type="submit">Login</button>
	</form>
	<p>Don't have an account? Register <a class="text-blue-500" data-sveltekit-preload-data href="/register">here!</a></p>

	{#if form?.error}
		<ErrorMsg error={form.error} />
	{/if}
	<div class="h-full" />
</div>
