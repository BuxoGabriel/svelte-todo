<script lang="ts">
	import '../app.css';
	import Navbar from "$lib/components/Navbar.svelte"
</script>

<div class="min-h-screen h-full w-full max-w-full">
	<Navbar/>
	<slot />
</div>
