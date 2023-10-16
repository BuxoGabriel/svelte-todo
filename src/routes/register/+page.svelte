<script>
    export let form;
	import { enhance } from "$app/forms";
    import ErrorMsg from "../../components/ErrorMsg.svelte";
</script>

<h1>Register</h1>
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

{#if form?.error}
   <ErrorMsg error={form.error} />
{/if}