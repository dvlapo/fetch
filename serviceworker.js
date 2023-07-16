// self.addEventListener("fetch", async (event) => {
//     event.respondWith(
//         (async () => {
//             try {
//                 const fetchResponse = await fetch(event.request);
//                 // TODO: Update the cache
//                 const cache = await caches.open("cm-updatedassets");
//                 cache.put(event.request, fetchResponse.clone());
//                 return fetchResponse;
//             } catch (e) {
//                 const cachedResponse = await caches.match(event.request);
//                 if (cachedResponse) return cachedResponse;
//             }
//         })()
//     );
// });
