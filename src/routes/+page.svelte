<script lang="ts">
    import PwaInstall from "$lib/components/PWAInstall.svelte";
    import { loggedIn } from "$lib/stores/login"
    $loggedIn = false
</script>

<div class="flex flex-col items-center justify-center my-6">
	<h1 class="text-center text-4xl">Welcome to Todo App!</h1>
    <div class="flex flex-col gap-4 my-8 px-2 pt-2 pb-8 border-slate-400">
        <a href="/list" class="bg-slate-800 text-white px-4 py-2 rounded hover:bg-blue-400 transition">Continue with account (online)</a>
        <a href="/local" class="bg-slate-800 text-white px-4 py-2 rounded hover:bg-blue-400 transition">Continue without an account (offline)</a>
        <PwaInstall />
    </div>
</div>