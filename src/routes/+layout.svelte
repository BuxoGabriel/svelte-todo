<script>
	import '../app.css';
	import Navbar from "$lib/components/Navbar.svelte"
</script>
<div class="min-h-screen h-full w-full max-w-full bg-slate-200">
	<Navbar/>
	<slot />
</div>
