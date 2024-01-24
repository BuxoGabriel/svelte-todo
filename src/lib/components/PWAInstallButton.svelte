<script lang="ts">
	import { browser } from "$app/environment";

    let defferedPrompt: any = null

    if(browser) {
        window.addEventListener('beforeinstallprompt', (event) => {
            event.preventDefault()
            defferedPrompt = event
        })
    }

    const installApp = () => {
        console.log("install button pressed")
        console.log(defferedPrompt)
        if(defferedPrompt) {
            defferedPrompt.prompt()
            defferedPrompt.userChoice.then((choiceResult: any) => {
                if(choiceResult.outcome === 'accepted') {
                    console.log('User accepted the A2HS prompt')
                }
                else {
                    console.log('user dissmissed A2HS prompt')
                }
                defferedPrompt = null
            })
        }
    }
</script>

{#if defferedPrompt}
    <button on:click={installApp} class="bg-slate-800 text-white text-center px-2 py-2 hover:bg-blue-500 transition">Install Todo App</button>
{/if}