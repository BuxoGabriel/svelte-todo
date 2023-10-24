import { crossfade, fly } from "svelte/transition";

export const [send, recieve] = crossfade({
    duration: 750,
    fallback: (node) => fly(node, {x: 200, duration: 750})
})