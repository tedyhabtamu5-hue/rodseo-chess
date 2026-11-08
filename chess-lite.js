/* chess-lite.js - compact legal-move chess rules (0x88 board). Exposes global Chess. No dependencies. */
(function(root){
"use strict";
var FILES="abcdefgh",TY=" pnbrqk";
var NO=[-33,-31,-18,-14,14,18,31,33],KO=[-17,-16,-15,-1,1,15,16,17],BO=[-17,-15,15,17],RO=[-16,-1,1,16];
var CR=[],z;for(z=0;z<128;z++)CR[z]=15;CR[112]=13;CR[119]=14;CR[116]=12;CR[0]=7;CR[7]=11;CR[4]=3;
function sq2n(s){return FILES[s&7]+(8-(s>>4))}
function n2sq(n){if(typeof n!=="string"||n.length<2)return -1;return(8-(+n[1]))*16+FILES.indexOf(n[0])}
function uci(m){return sq2n(m.f)+sq2n(m.t)+(m.pr?TY[m.pr]:"")}
function pc(c){return c?{type:TY[c&7],color:(c>>3)?"b":"w"}:null}
function Chess(fen){this.load(fen||"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")}
var P=Chess.prototype;
P.load=function(fen){var f=fen.split(" "),r=0,c=0,i,ch,t,s;
this.b=[];for(i=0;i<128;i++)this.b[i]=0;
for(i=0;i<f[0].length;i++){ch=f[0][i];if(ch==="/"){r++;c=0}else if(ch>="1"&&ch<="8")c+=+ch;else{t=TY.indexOf(ch.toLowerCase());this.b[r*16+c]=t|((ch===ch.toLowerCase()?1:0)<<3);c++}}
this.side=f[1]==="b"?1:0;s=f[2]||"-";
this.cr=(s.indexOf("K")>-1?1:0)|(s.indexOf("Q")>-1?2:0)|(s.indexOf("k")>-1?4:0)|(s.indexOf("q")>-1?8:0);
this.ep=f[3]&&f[3]!=="-"?n2sq(f[3]):-1;this.half=+f[4]||0;this.full=+f[5]||1;
this.k=[0,0];for(i=0;i<128;i++){if(i&136){i+=7;continue}if((this.b[i]&7)===6)this.k[this.b[i]>>3]=i}
this.us=[];this.sans=[];this.mvs=[];this.recs=[];this.keys=[this.key()]};
P.key=function(){return this.b.join(",")+"|"+this.side+this.cr+this.ep};
P.att=function(s,c){var b=this.b,i,x,d,t;
if(c===0){if(!((s+15)&136)&&b[s+15]===1)return true;if(!((s+17)&136)&&b[s+17]===1)return true}
else{if(!((s-15)&136)&&b[s-15]===9)return true;if(!((s-17)&136)&&b[s-17]===9)return true}
for(i=0;i<8;i++){x=s+NO[i];if(!(x&136)&&b[x]===((c<<3)|2))return true;x=s+KO[i];if(!(x&136)&&b[x]===((c<<3)|6))return true}
for(i=0;i<4;i++){d=BO[i];x=s+d;while(!(x&136)){t=b[x];if(t){if(t===((c<<3)|3)||t===((c<<3)|5))return true;break}x+=d}
d=RO[i];x=s+d;while(!(x&136)){t=b[x];if(t){if(t===((c<<3)|4)||t===((c<<3)|5))return true;break}x+=d}}
return false};
P.gen=function(){var b=this.b,me=this.side,out=[],s,p,t,x,y,d,i,O,D,promo,dir=me?-0:0;dir=me?16:-16;
function add(f,to,pr,cp,fl){out.push({f:f,t:to,pr:pr||0,cp:cp||0,fl:fl||0})}
for(s=0;s<128;s++){if(s&136){s+=7;continue}p=b[s];if(!p||(p>>3)!==me)continue;t=p&7;
if(t===1){x=s+dir;promo=me?(x>>4)===7:(x>>4)===0;
if(!b[x]){if(promo){add(s,x,5);add(s,x,4);add(s,x,3);add(s,x,2)}else{add(s,x,0);if((me?(s>>4)===1:(s>>4)===6)&&!b[x+dir])add(s,x+dir,0,0,2)}}
for(d=-1;d<=1;d+=2){y=x+d;if(y&136)continue;
if(b[y]&&(b[y]>>3)!==me){if(promo){add(s,y,5,b[y]);add(s,y,4,b[y]);add(s,y,3,b[y]);add(s,y,2,b[y])}else add(s,y,0,b[y])}
else if(y===this.ep&&!b[y])add(s,y,0,((1-me)<<3)|1,1)}}
else if(t===2||t===6){O=t===2?NO:KO;for(i=0;i<8;i++){x=s+O[i];if(x&136)continue;if(!b[x])add(s,x);else if((b[x]>>3)!==me)add(s,x,0,b[x])}}
else{D=t===3?BO:t===4?RO:KO;for(i=0;i<D.length;i++){d=D[i];x=s+d;while(!(x&136)){if(!b[x])add(s,x);else{if((b[x]>>3)!==me)add(s,x,0,b[x]);break}x+=d}}}}
var cr=this.cr,base=me?0:112;
if(this.k[me]===base+4&&!this.att(base+4,1-me)){
if((cr&(me?4:1))&&!b[base+5]&&!b[base+6]&&b[base+7]===((me<<3)|4)&&!this.att(base+5,1-me)&&!this.att(base+6,1-me))add(base+4,base+6,0,0,4);
if((cr&(me?8:2))&&!b[base+3]&&!b[base+2]&&!b[base+1]&&b[base]===((me<<3)|4)&&!this.att(base+3,1-me)&&!this.att(base+2,1-me))add(base+4,base+2,0,0,4)}
return out};
P.mk=function(m){var b=this.b,me=this.side,p=b[m.f],r;
this.us.push({m:m,cr:this.cr,ep:this.ep,half:this.half,p:p});
b[m.t]=m.pr?((me<<3)|m.pr):p;b[m.f]=0;
if(m.fl&1)b[m.t+(me?-16:16)]=0;
if(m.fl&4){if(m.t>m.f){b[m.t-1]=b[m.t+1];b[m.t+1]=0}else{b[m.t+1]=b[m.t-2];b[m.t-2]=0}}
if((p&7)===6)this.k[me]=m.t;
this.cr&=CR[m.f]&CR[m.t];
this.ep=(m.fl&2)?((m.f+m.t)>>1):-1;
this.half=((p&7)===1||m.cp)?0:this.half+1;if(me)this.full++;this.side=1-me};
P.un=function(){var u=this.us.pop(),m=u.m,b=this.b,me=1-this.side;this.side=me;
b[m.f]=u.p;b[m.t]=(m.cp&&!(m.fl&1))?m.cp:0;
if(m.fl&1)b[m.t+(me?-16:16)]=m.cp;
if(m.fl&4){if(m.t>m.f){b[m.t+1]=b[m.t-1];b[m.t-1]=0}else{b[m.t-2]=b[m.t+1];b[m.t+1]=0}}
if((u.p&7)===6)this.k[me]=m.f;
this.cr=u.cr;this.ep=u.ep;this.half=u.half;if(me)this.full--};
P.legal=function(){var ps=this.gen(),out=[],me=this.side,i;
for(i=0;i<ps.length;i++){this.mk(ps[i]);if(!this.att(this.k[me],1-me))out.push(ps[i]);this.un()}return out};
P.turn=function(){return this.side?"b":"w"};
P.get=function(n){return pc(this.b[n2sq(n)])};
P.board=function(){var o=[],r,c,row;for(r=0;r<8;r++){row=[];for(c=0;c<8;c++)row.push(pc(this.b[r*16+c]));o.push(row)}return o};
P.in_check=function(){return this.att(this.k[this.side],1-this.side)};
P.moves=function(o){var L=this.legal(),s,self=this;o=o||{};
if(o.square){s=n2sq(o.square);L=L.filter(function(m){return m.f===s})}
return L.map(function(m){return{from:sq2n(m.f),to:sq2n(m.t),promotion:m.pr?TY[m.pr]:undefined,captured:m.cp?TY[m.cp&7]:undefined,piece:TY[self.b[m.f]&7]}})};
P.san=function(m,L){var p=this.b[m.f],t=p&7,s="",i,o,sf=false,sr=false,amb=false;
if(m.fl&4)return m.t>m.f?"O-O":"O-O-O";
if(t===1){if(m.cp)s=FILES[m.f&7]+"x"}
else{s=TY[t].toUpperCase();
for(i=0;i<L.length;i++){o=L[i];if(o!==m&&o.t===m.t&&(this.b[o.f]&7)===t){amb=true;if((o.f&7)===(m.f&7))sf=true;if((o.f>>4)===(m.f>>4))sr=true}}
if(amb){if(!sf)s+=FILES[m.f&7];else if(!sr)s+=(8-(m.f>>4));else s+=sq2n(m.f)}
if(m.cp)s+="x"}
s+=sq2n(m.t);if(m.pr)s+="="+TY[m.pr].toUpperCase();return s};
P.move=function(x){var L=this.legal(),m=null,i,c,f,t,s,rec,p;
if(typeof x==="string"){for(i=0;i<L.length;i++)if(this.san(L[i],L)===x.replace(/[+#]/g,"")){m=L[i];break}}
else if(x&&typeof x==="object"){f=n2sq(x.from);t=n2sq(x.to);
for(i=0;i<L.length;i++){c=L[i];if(c.f===f&&c.t===t&&(!c.pr||TY[c.pr]===(x.promotion||"q"))){m=c;break}}}
if(!m)return null;
s=this.san(m,L);p=this.b[m.f];
rec={from:sq2n(m.f),to:sq2n(m.t),captured:m.cp?TY[m.cp&7]:undefined,promotion:m.pr?TY[m.pr]:undefined,piece:TY[p&7],color:this.side?"b":"w"};
this.mk(m);
if(this.in_check())s+=this.legal().length?"+":"#";
rec.san=s;this.sans.push(s);this.mvs.push(uci(m));this.recs.push(rec);this.keys.push(this.key());return rec};
P.history=function(o){return o&&o.verbose?this.recs.slice():this.sans.slice()};
P.uci=function(){return this.mvs.slice()};
P.in_checkmate=function(){return this.in_check()&&!this.legal().length};
P.in_stalemate=function(){return !this.in_check()&&!this.legal().length};
P.insuff=function(){var n=0,i,t;for(i=0;i<128;i++){if(i&136){i+=7;continue}t=this.b[i]&7;if(t&&t!==6){if(t===1||t===4||t===5)return false;n++}}return n<=1};
P.rep=function(){var k=this.keys[this.keys.length-1],c=0,i;for(i=0;i<this.keys.length;i++)if(this.keys[i]===k)c++;return c>=3};
P.in_draw=function(){return this.half>=100||this.insuff()||this.rep()||this.in_stalemate()};
P.game_over=function(){return this.in_checkmate()||this.in_draw()};
Chess.uci=uci;
root.Chess=Chess;if(typeof module!=="undefined")module.exports=Chess;
})(typeof self!=="undefined"?self:this);
