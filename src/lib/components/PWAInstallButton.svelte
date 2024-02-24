<script lang="ts">
	import { browser } from "$app/environment";

    let deferedPrompt: any = null

    if(browser) {
        window.addEventListener('beforeinstallprompt', (event) => {
            event.preventDefault()
            deferedPrompt = event
        })
    }

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

{#if deferedPrompt}
    <button on:click={installApp} class="bg-slate-800 text-white text-center px-2 py-2 hover:bg-blue-500 transition">Install Todo App</button>
{/if}