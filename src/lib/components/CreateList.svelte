<script lang="ts">
    import Modal from "./Modal.svelte"
    export let action: import("svelte/elements").FormEventHandler<HTMLFormElement>;
    export let showModal = false;
</script>

<Modal bind:showModal>
    <div class="w-96 mb-4">
        <form class="flex flex-col" on:submit={action}>
            <div class="flex flex-row my-4">
                <label for="name" class="px-2 text-lg">List Name:</label>
                <input class="w-max grow bg-white border border-black h-8" id="name" name="name" type="text" />
            </div>
            <button class="grow border border-black h-8" type="submit">Create List</button>
        </form>

    </div>
</Modal>    