<script lang="ts">
	import { browser } from "$app/environment";
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";

    let deferedPrompt: any = null;
    let promptClosed = false;

    const handleBeforeInstallPrompt = (event: any) => {
        event.preventDefault()
        deferedPrompt = event
    };

    onMount(() => {
        if(browser) window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
        return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    });

    const installApp = () => {
        console.log("install button pressed")
        console.log(deferedPrompt)
        if(deferedPrompt) {
            deferedPrompt.prompt()
            deferedPrompt.userChoice.then((choiceResult: any) => {
                if(choiceResult.outcome === 'accepted') {
                    console.log('User accepted the A2HS prompt')
                }
                else {
                    console.log('user dissmissed A2HS prompt')
                }
                deferedPrompt = null
            })
        }
    }
</script>

{#if deferedPrompt && !promptClosed}
    <div transition:fade={{ delay: 250, duration: 300 }} class="absolute top-1/2 left-1/2 bg-slate-400 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded ring ring-black">
        <button on:click={() => promptClosed = true} class="text-slate-800 pt-2 pr-4 float-right font-bold">X</button>
        <div class=" w-full h-full text-center flex flex-col justify-around">
            <p class="pt-10">Installing Todo App allows for easy access and a friendlier user experience. Click the button below to install Todo App Today!</p>
            <button on:click={installApp} class="bg-slate-800 text-white text-center px-2 py-8 w-64 rounded m-auto hover:bg-blue-500 transition">Install Todo App</button>
        </div>
    </div>
{/if}