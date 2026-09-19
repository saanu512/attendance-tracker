const CACHE="attendance-tracker-firebase-v128";
const ASSETS=["./","./index.html","./manifest.json","./styles.css","./app.js","./firebase-cloud.js","./icon-192.png","./icon-512.png"];

self.addEventListener("install",event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));
});

self.addEventListener("activate",event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});

self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET")return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin)return;
  const isShell=url.pathname.endsWith("/")||url.pathname.endsWith("/index.html")||/\.(?:js|css|json|png|webp|jpg|jpeg|svg|ico|woff2?)$/i.test(url.pathname);
  if(!isShell)return;
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE);
    const cached=await cache.match(event.request);
    const refresh=fetch(new Request(event.request,{cache:"no-store"})).then(response=>{
      if(response&&response.ok&&!response.opaque)return cache.put(event.request,response.clone()).then(()=>response);
      return response;
    }).catch(()=>null);
    if(cached){event.waitUntil(refresh.then(()=>undefined));return cached;}
    return (await refresh)||Response.error();
  })());
});
