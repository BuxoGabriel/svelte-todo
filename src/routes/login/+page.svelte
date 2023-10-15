<script>
    export let form;
	import { enhance } from "$app/forms";
</script>

<h1>Login</h1>
<form method="POST" use:enhance>
    <label>Username:
        <input
            id="username"
            type="username"
            name="username"
            placeholder="Enter your username"
            value={form?.username ?? ''}
            required autofocus />
    </label>

    <label>Password:
        <input
            id="password"
            type="password"
            name="password"
            placeholder="Enter your password"
            required />
    </label>
    <button type="submit">Login</button>
</form>
<p>Don't have an account? Register <a href="/register">here!</a></p>

{#if form?.error}
    <p style="color: red; font-size: 1rem;">{form.error}</p>
{/if}