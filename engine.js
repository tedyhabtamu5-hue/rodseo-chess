/* engine.js - built-in fallback engine (Web Worker). Iterative deepening alpha-beta + quiescence. */
importScripts("chess-lite.js");
var VAL=[0,100,320,335,500,900,0],nodes=0,dl=0,stop=false;
function ev(g){var b=g.b,s=0,r,c,p,t,cen,v,a;
for(r=0;r<8;r++)for(c=0;c<8;c++){p=b[r*16+c];if(!p)continue;t=p&7;cen=3.5-Math.max(Math.abs(r-3.5),Math.abs(c-3.5));v=VAL[t];
if(t===1){a=(p>>3)?r-1:6-r;v+=a*7+cen*4+(a>=5?a*12:0)}
else if(t===2||t===3)v+=cen*13;else if(t===5)v+=cen*3;else if(t===6)v-=cen*9;
s+=(p>>3)?-v:v}
return g.side?-s:s}
function order(g,ms){var i,m;for(i=0;i<ms.length;i++){m=ms[i];m.o=(m.cp?10000+VAL[m.cp&7]*10-VAL[g.b[m.f]&7]/10:0)+(m.pr?9000:0)}ms.sort(function(a,b){return b.o-a.o})}
function tk(){if((++nodes&1023)===0&&Date.now()>dl)stop=true}
function qs(g,a,b){tk();if(stop)return 0;var st=ev(g),ms,i,m,sc;if(st>=b)return st;if(st>a)a=st;
ms=g.gen().filter(function(m){return m.cp||m.pr});order(g,ms);
for(i=0;i<ms.length;i++){m=ms[i];g.mk(m);if(g.att(g.k[1-g.side],g.side)){g.un();continue}sc=-qs(g,-b,-a);g.un();if(stop)return 0;if(sc>=b)return sc;if(sc>a)a=sc}
return a}
function ab(g,d,a,b,ply){tk();if(stop)return 0;if(g.half>=100)return 0;
var inc=g.att(g.k[g.side],1-g.side),ms,i,m,sc,n=0,best=-1e9;
if(inc&&ply<30)d++;if(d<=0)return qs(g,a,b);
ms=g.gen();order(g,ms);
for(i=0;i<ms.length;i++){m=ms[i];g.mk(m);if(g.att(g.k[1-g.side],g.side)){g.un();continue}n++;
sc=-ab(g,d-1,-b,-a,ply+1);g.un();if(stop)return 0;
if(sc>best){best=sc;if(sc>a){a=sc;if(a>=b)return a}}}
if(!n)return inc?-1e5+ply:0;return best}
function search(g,ms){var L=g.legal(),best,bs=0,d,i,a,bm,sc,pv=null,j;
if(!L.length)return{mv:null,sc:0};if(L.length===1)return{mv:Chess.uci(L[0]),sc:0};
best=L[0];nodes=0;stop=false;dl=Date.now()+ms;
for(d=1;d<=14;d++){order(g,L);
if(pv){j=L.indexOf(pv);if(j>0){L.splice(j,1);L.unshift(pv)}}
a=-1e9;bm=null;
for(i=0;i<L.length;i++){g.mk(L[i]);sc=-ab(g,d-1,-1e9,-a,1);g.un();if(stop)break;if(sc>a||!bm){a=sc;bm=L[i]}}
if(stop)break;best=bm;bs=a;pv=bm;if(Math.abs(a)>9e4)break}
return{mv:Chess.uci(best),sc:bs}}
if(typeof onmessage!=="undefined"||typeof self!=="undefined"){self.onmessage=function(e){var d=e.data,g=new Chess(),i,u;
for(i=0;i<d.moves.length;i++){u=d.moves[i];g.move({from:u.slice(0,2),to:u.slice(2,4),promotion:u[4]})}
self.postMessage(search(g,d.ms))}}
