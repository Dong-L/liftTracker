const VERSION = "v1"; /* changing this version # is the best practice way to the trigger the PWA 
to register changes and updates to other files */
const CACHE_NAME = `lift-tracker-${VERSION}`; // cache for storing offline resources, updates w/ version

const APP_STATIC_RESOURCES = [
    "/",
    "/index.html",
    "/style.css",
    "/app.js",
    "/liftTracker.json",
    // "/icons/wheel.svg",
    // "/icon-512x512.png",
];

self.addEventListener("install", (e) => { // every time service worker is updated, browser installs new sw and install event is triggered
    // install also happens when app is used for the first time
    e.waitUntil((async () => {
        const cache = await caches.open("CACHE_NAME");
        cache.addAll(APP_STATIC_RESOURCES);
    })(),
  );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        (async () => {
            const names = await caches.keys();
            await Promise.all(
                names.map((name) => {
                    if (name !== CACHE_NAME) {
                        return caches.delete(name);
                    }
                }),
            );
            await clients.claim();
        })(),
    );
});

self.addEventListener("fetch", (event) => {
    // when seeking an HTML page
    if (event.request.mode === "navigate") {
        // Return to the index.html page
        event.respondWith(caches.match("/"));
        return;
    }

    // For every other request type
    event.respondWith(
        (async () => {
            const cache = await caches.open(CACHE_NAME);
            const cachedResponse = await cache.match(event.request.url);
            if (cachedResponse) {
                // Return the cached response if it's available.
                return cachedResponse;
            }
            // Respond with a HTTP 404 response status.
            return new Response(null, { status: 404 });
        })(),
    );
});