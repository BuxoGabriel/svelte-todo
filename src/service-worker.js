/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

const sw = /** @type {ServiceWorkerGlobalScope} */ (/** @type {unknown} */ (self));

import { build, files, version } from "$service-worker"

const CACHE = `TodoApp-${version}`

const ASSETS = [
    ...build,   // The app itself
    ...files    // Everything in 'static'
];

sw.addEventListener("install", e => {
    e.waitUntil(
        (async () => {
            const cache = await caches.open(CACHE)
            cache.addAll(ASSETS)
        })()
    )
})

sw.addEventListener("activate", e => {
    e.waitUntil((
        async () => {
            const names = await caches.keys()
            await Promise.all(
                names.map(name => {
                    if (name !== CACHE) return caches.delete(name)
                })
            )
            await clients.claim()
        })()
    )
})

sw.addEventListener('fetch', (event) => {
	// ignore POST requests etc
	if (event.request.method !== 'GET') return;

	async function respond() {
		const url = new URL(event.request.url);
		const cache = await caches.open(CACHE);

		// `build`/`files` can always be served from the cache
		if (ASSETS.includes(url.pathname)) {
			return cache.match(url.pathname);
		}

		// for everything else, try the network first, but
		// fall back to the cache if we're offline
		try {
			const response = await fetch(event.request);

			if (response.status === 200) {
				cache.put(event.request, response.clone());
			}

			return response;
		} catch {
			return cache.match(event.request);
		}
	}

	event.respondWith(respond());
});