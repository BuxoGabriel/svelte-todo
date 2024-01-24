<script lang="ts">
	import { loggedIn } from "$lib/stores/login";
	import LogoutButton from "./LogoutButton.svelte";
</script>

<nav class="h-20 p-2 bg-slate-800 flex flex-row align-center justify-between">
    <div class="text-4xl px-2 text-gray-300">Todo App</div>
    {#if $loggedIn}
        <LogoutButton/>
    {/if}
</nav>