<script>
	export let form;
	import { enhance } from '$app/forms';
	import ErrorMsg from '$lib/components/ErrorMsg.svelte';
</script>

<div class="flex flex-col items-center justify-center my-6">
	<h1 class="text-center text-4xl">Register</h1>
	<form class="flex flex-col my-8 border" method="POST" use:enhance>
		<label
			>Username:
			<input
				id="username"
                class="w-full"
				type="username"
				name="username"
				placeholder="Enter your username"
				value={form?.username ?? ''}
				required
				autofocus
			/>
		</label>

		<label
			>Password:
			<input
				id="password"
                class="w-full"
				type="password"
				name="password"
				placeholder="Enter your password"
				required
			/>
		</label>
		<button class="border border-black" type="submit">Login</button>
	</form>
	<p>Have an account already? Login <a class="text-blue-800" href="/login">here!</a></p>

	{#if form?.error}
		<ErrorMsg error={form.error} />
	{/if}
	<div class="h-full" />
</div>
