<script lang="ts">
	import '../app.css';
	import Navbar from "$lib/components/Navbar.svelte"
</script>

<div class="min-h-screen w-full max-w-full overflow-hidden">
	<Navbar/>
	<slot />
</div>
