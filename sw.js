const CACHE="attendance-tracker-v22-earth-editions";
const ASSETS = ['./','./index.html','./manifest.json','./styles.css','./app.js','./icon-192.png','./icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE="attendance-tracker-v22-earth-editions"; });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE="attendance-tracker-v22-earth-editions"; });
self.addEventListener('fetch', e => { if(e.request.method!=='GET') return; e.respondWith(fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE="attendance-tracker-v22-earth-editions";return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html')))); });
