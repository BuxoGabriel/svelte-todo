<script>
	import '../app.css';
</script>
<div class="h-screen bg-slate-200">
	<nav class="h-20 p-2 bg-slate-800 flex flex-row align-center justify-between">
		<div class="text-4xl px-2 text-gray-300">Todo App</div>
		<form class="px-2" action="/logout" method="DELETE">
			<button
				class="p-4 border rounded-xl bg-slate-200 text-black hover:text-white hover:bg-slate-500 hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
				type="submit">Log Out</button
			>
		</form>
	</nav>
	<slot />
</div>

<style>
	button {
		box-shadow: 0.25rem 0.25rem 0 0 rgb(100 116 139);
	}
</style>
