self.addEventListener('install', event => {
  console.log('Service Worker install.');
});

function getCache() {
  return caches.open('v1');
}

async function fetchAndCache(request) {
  const response = await fetch(request, {mode: 'cors', credentials: 'same-origin'});
  cache = await getCache();
  cache.put(request, response.clone());
  return response;
}

async function getFromNetworkOrCache(request) {
  try {
    return await fetchAndCache(request);
  } catch (e) {
    cache = await getCache();
    return caches.match(request);
  }
}

self.addEventListener('fetch', (event) => {
  event.respondWith(getFromNetworkOrCache(event.request));
});
