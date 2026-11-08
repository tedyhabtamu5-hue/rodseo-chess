/* sf-worker.js - runs the real Stockfish (asm.js) inside a Web Worker so the page never freezes.
   It tries a local copy first (vendor/stockfish.js), then public CDNs. If none loads, the page
   automatically uses the built-in engine instead. */
var SOURCES=["vendor/stockfish.js",
"https://cdn.jsdelivr.net/npm/stockfish@10.0.2/src/stockfish.js",
"https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.2/stockfish.js",
"https://unpkg.com/stockfish@10.0.2/src/stockfish.js"];
var loaded=false,i;
for(i=0;i<SOURCES.length&&!loaded;i++){try{importScripts(SOURCES[i]);loaded=true}catch(e){}}
if(!loaded)postMessage("sf-unavailable");
