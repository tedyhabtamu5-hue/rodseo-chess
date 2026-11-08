/* sw.js - makes RODSEO installable and playable offline. Bump VERSION to force an update. */
var VERSION="rodseo-v1",CORE=["./","index.html","chess-lite.js","engine.js","sf-worker.js","manifest.webmanifest","icons/icon-192.png","icons/icon-512.png","icons/maskable-512.png","icons/apple-touch-icon.png"];
self.addEventListener("install",function(e){e.waitUntil(caches.open(VERSION).then(function(c){return c.addAll(CORE)}).then(function(){return self.skipWaiting()}))});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(n){return n!==VERSION}).map(function(n){return caches.delete(n)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener("fetch",function(e){var r=e.request;if(r.method!=="GET")return;
var same=new URL(r.url).origin===self.location.origin;
e.respondWith(caches.match(r,{ignoreSearch:true}).then(function(hit){
var net=fetch(r).then(function(res){if(res&&(res.ok||res.type==="opaque")){var cp=res.clone();caches.open(VERSION).then(function(c){c.put(r,cp)})}return res}).catch(function(){return hit});
return same&&hit?hit:net.then(function(x){return x||hit})}))});
