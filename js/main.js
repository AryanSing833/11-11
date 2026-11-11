(function(){'use strict';
var $=function(s){return document.querySelector(s)},$$=function(s){return[].slice.call(document.querySelectorAll(s))};
var RM=matchMedia('(prefers-reduced-motion:reduce)').matches,M=window.MEM,body=document.body;
var months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function fd(s){var p=s.split('-');return +p[2]+' '+months[+p[1]-1]+' '+p[0]}
/* ---------- sky ---------- */
var cv=$('#sky'),cx=cv.getContext('2d'),W,H,stars=[],dust=[],vis=0;
function rs(){W=cv.width=innerWidth;H=cv.height=innerHeight;stars=[];dust=[];for(var i=0;i<(W<600?90:170);i++)stars.push({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.3+.2,p:Math.random()*6});for(i=0;i<28;i++)dust.push({x:Math.random()*W,y:Math.random()*H,r:Math.random()*2+1,v:Math.random()*.3+.1})}
function draw(t){cx.clearRect(0,0,W,H);cx.fillStyle='#F5EBDD';
stars.forEach(function(s){cx.globalAlpha=vis*(.35+.65*Math.abs(Math.sin(t/1400+s.p)));cx.beginPath();cx.arc(s.x,s.y,s.r,0,7);cx.fill()});
cx.fillStyle='#C8A66A';dust.forEach(function(d){d.y-=d.v;if(d.y<-5){d.y=H+5;d.x=Math.random()*W}cx.globalAlpha=vis*.3;cx.beginPath();cx.arc(d.x,d.y,d.r,0,7);cx.fill()});
if(!RM)requestAnimationFrame(draw)}
addEventListener('resize',function(){rs();if(RM)draw(0)});rs();
function fade(){var s=0;(function f(){vis=Math.min(1,vis+.01);if(RM)draw(0);if(vis<1)requestAnimationFrame(f)})()}
if(RM)vis=1;requestAnimationFrame(draw);if(RM)draw(0);
/* ---------- audio ---------- */
var ac,sound=false,music,pad,muted=false;
function ctx(){if(!ac){try{ac=new(window.AudioContext||window.webkitAudioContext)()}catch(e){}}return ac}
function tick(){var a=ctx();if(!a||!sound)return;var o=a.createOscillator(),g=a.createGain();o.frequency.value=1400;g.gain.setValueAtTime(.05,a.currentTime);g.gain.exponentialRampToValueAtTime(.001,a.currentTime+.06);o.connect(g);g.connect(a.destination);o.start();o.stop(a.currentTime+.07)}
function synth(){var a=ctx();if(!a||pad)return;pad=a.createGain();pad.gain.value=.05;pad.connect(a.destination);[110,164.8,220,277.2].forEach(function(f,i){var o=a.createOscillator();o.type='sine';o.frequency.value=f;o.detune.value=i*4;o.connect(pad);o.start()})}
function startMusic(){music=new Audio('assets/audio/Umraan%20Lameriyan%20-%20Juss.mp3');music.loop=true;music.volume=.5;music.addEventListener('error',function(){music=null;synth()});var p=music.play();if(p&&p.catch)p.catch(function(){music=null;synth()})}
function setMute(m){muted=m;var b=$('#mute');b.setAttribute('aria-pressed',m);b.textContent=m?'♪ Off':'♪ On';if(music)music.muted=m;if(pad)pad.gain.value=m?0:.05}
$('#mute').onclick=function(){setMute(!muted)};
$('#snd0').onclick=function(){sound=!sound;if(sound)ctx();this.setAttribute('aria-pressed',sound);this.textContent='Sound: '+(sound?'on':'off')};
/* ---------- intro ---------- */
var T=[];function later(f,ms){T.push(setTimeout(f,ms))}
function intro(){T.forEach(clearTimeout);T=[];var c=$('#clk'),i=$('#intro');i.className='';c.className='clk';c.innerHTML='11:09 <small>PM</small>';['#il1','#il2','#il3'].forEach(function(s){$(s).classList.remove('show')});$('#enter').hidden=true;body.classList.add('locked');vis=RM?1:0;if(!RM)fade();
var k=RM?.2:1;tick();later(function(){c.innerHTML='11:10 <small>PM</small>';tick()},1800*k);
later(function(){c.innerHTML='11:11 <small>PM</small>';c.classList.add('on');i.classList.add('lit');tick();tick()},3600*k);
later(function(){$('#il1').classList.add('show')},4800*k);later(function(){$('#il2').classList.add('show')},8000*k);later(function(){$('#il3').classList.add('show')},10800*k);
later(function(){$('#enter').hidden=false;$('#enter').focus()},12200*k)}
$('#enter').onclick=function(){$('#intro').classList.add('out');$('#nav').hidden=false;$('#main').hidden=false;if(!music&&!pad)startMusic();else setMute(muted);setTimeout(function(){$('#intro').style.display='none';body.classList.remove('locked');scrollTo(0,0);watch()},RM?10:1500)};
$('#intro').addEventListener('transitionend',function(){});
/* ---------- nav / cursor / parallax ---------- */
$('#burger').onclick=function(){var o=$('#menu').classList.toggle('open');this.setAttribute('aria-expanded',o)};
$$('#menu a').forEach(function(a){a.onclick=function(){$('#menu').classList.remove('open')}});
if(matchMedia('(hover:hover) and (pointer:fine)').matches){body.classList.add('cc');var cu=$('#cur');addEventListener('mousemove',function(e){cu.style.transform='translate('+(e.clientX-7)+'px,'+(e.clientY-7)+'px)';cu.classList.toggle('h',!!e.target.closest('button,a'))})}
addEventListener('scroll',function(){document.documentElement.style.setProperty('--sy',scrollY)},{passive:true});
/* ---------- chat rendering ---------- */
function bubbles(el,msgs,d){el.innerHTML='';msgs.forEach(function(m,i){var b=document.createElement('div');b.className='b '+m[0];b.style.animationDelay=(RM?0:i*.35)+'s';var w=document.createElement('em');w.textContent=m[0]=='A'?'Aryan':'Mahima';var t=document.createElement('span');t.textContent=m[2];var ts=document.createElement('i');ts.textContent=(d?fd(d)+', ':'')+m[1];b.append(w,t,ts);el.appendChild(b)})}
/* timeline */
var tl=$('#tl');M.tl.forEach(function(e){var li=document.createElement('li');li.className='rv';var it=M.cats[e.c[0]].i[e.c[1]];li.innerHTML='<time></time><h3></h3><p></p><div class="chat bub-wrap"></div>';li.children[0].textContent=e.d;li.children[1].textContent=e.t;li.children[2].textContent=e.p;bubbles(li.children[3],e.x||it.m.slice(0,4),it.d);tl.appendChild(li)});
/* museum */
var cur='roast',keys=Object.keys(M.cats),tabs=$('#tabs'),room=$('#room');
keys.forEach(function(k){var b=document.createElement('button');b.setAttribute('role','tab');b.textContent=M.cats[k].n;b.onclick=function(){show(k,0)};b.dataset.k=k;tabs.appendChild(b)});
function show(k,idx){cur=k;var c=M.cats[k],it=c.i[idx];$$('#tabs button').forEach(function(b){b.setAttribute('aria-selected',b.dataset.k==k)});room.innerHTML='<div class="d"></div><div class="desc"></div><div class="chat"></div>';room.children[0].textContent=c.n;room.children[1].textContent=c.d;bubbles(room.children[2],it.m,it.d)}
function all(){var a=[];keys.forEach(function(k){M.cats[k].i.forEach(function(x,i){a.push([k,i,x])})});return a}
var last=-1;$('#another').onclick=function(){var a=all(),n;do{n=Math.floor(Math.random()*a.length)}while(n==last&&a.length>1);last=n;show(a[n][0],a[n][1]);room.scrollIntoView({block:'center',behavior:RM?'auto':'smooth'})};
show('roast',0);
/* jokes */
var jg=$('#jg');M.jokes.forEach(function(j){var b=document.createElement('button');b.className='jc rv';b.setAttribute('aria-pressed','false');b.innerHTML='<div><span class="f"></span><span class="k"></span></div>';b.querySelector('.f').innerHTML='<b style="font-weight:400"></b><small>tap to decode</small>';b.querySelector('b').textContent=j[0];b.querySelector('.k').textContent=j[1];b.onclick=function(){b.setAttribute('aria-pressed',b.getAttribute('aria-pressed')!='true')};jg.appendChild(b)});
/* gallery */
var imageFiles=[
 'WhatsApp Image 2026-11-10 at 19.56.04.jpeg',
 'WhatsApp Image 2026-11-10 at 19.56.04 (1).jpeg',
 'WhatsApp Image 2026-11-10 at 19.56.03.jpeg',
 'WhatsApp Image 2026-11-10 at 19.56.02.jpeg',
 'WhatsApp Image 2026-10-06 at 22.42.37.jpeg',
 'image.png'
];
var pg=$('#pg');for(var n=1;n<=6;n++)(function(n){var b=document.createElement('button');b.className='pol rv';b.style.setProperty('--r',((n*37%9)-4)+'deg');b.setAttribute('aria-label','Open photo '+n);var cap=M.caps[n-1];b.innerHTML='<div class="ph"><span>'+ (imageFiles[n-1]?'Uploaded photo':'Photo coming soon') +'</span></div><p></p>';b.querySelector('p').textContent=cap;if(imageFiles[n-1]){var im=new Image();im.alt='Mahima and Aryan, '+cap;im.onload=function(){var ph=b.querySelector('.ph');ph.innerHTML='';ph.appendChild(im)};im.src=encodeURI('assets/images/'+imageFiles[n-1])}b.onclick=function(){var c=b.cloneNode(true);c.removeAttribute('style');c.className='pol';$('#lbc').innerHTML='';$('#lbc').appendChild(c);$('#lb').hidden=false;$('#lbx').focus()};pg.appendChild(b)})(n);
function closeLb(){$('#lb').hidden=true}$('#lbx').onclick=closeLb;$('#lb').onclick=function(e){if(e.target.id=='lb')closeLb()};
addEventListener('keydown',function(e){if(e.key=='Escape'){closeLb();closeWish()}});
/* memory machine */
$('#open').onclick=function(){var env=$('#env'),a=all(),pick=a[Math.floor(Math.random()*a.length)];env.classList.remove('open');env.classList.add('shuf');var i=0,iv=setInterval(function(){$('#mdate').textContent=fd(a[Math.floor(Math.random()*a.length)][2].d);if(++i>5){clearInterval(iv);env.classList.remove('shuf');$('#mdate').textContent=fd(pick[2].d);var mb=$('#mbody');mb.innerHTML='';pick[2].m.slice(0,4).forEach(function(m){var d=document.createElement('div');d.className=m[0];d.textContent=m[2];mb.appendChild(d)});setTimeout(function(){env.classList.add('open')},RM?0:200)}},RM?1:140)};
/* reveal + typewriter */
var typed=false;function type(){if(typed)return;typed=true;var s=M.letter,el=$('#tw');$('#twfull').textContent=s;el.setAttribute('aria-hidden','true');if(RM){el.textContent=s;return}var i=0;(function f(){el.textContent=s.slice(0,++i);if(i<s.length)setTimeout(f,32)})()}
function watch(){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');if(e.target.id=='letter')type();io.unobserve(e.target)}})},{threshold:.15});$$('.rv,#letter').forEach(function(x){io.observe(x)});$$('.rv').forEach(function(x){if(!x.classList.contains('in'))io.observe(x)})}
/* wish */
var wt=[];function closeWish(){ $('#wishOv').hidden=true;wt.forEach(clearTimeout);wt=[];$('#w1').className='';$('#w2').className='';$('#w1').textContent='';$('#w2').textContent='';$('#wishBtn').focus()}
$('#wclose').onclick=closeWish;
$('#wishBtn').onclick=function(){var o=$('#wishOv');o.hidden=false;$('#w1').className='';$('#w2').className='';$('#w1').textContent='';$('#w2').textContent='';$('#wclose').focus();constel();wt.push(setTimeout(function(){$('#w1').textContent='If the universe ever gives me another chance to choose the people who become part of my story, I’d still want you somewhere in it.';$('#w1').classList.add('show')},RM?0:3200));wt.push(setTimeout(function(){$('#w2').textContent='Happy 11:11, Mahima.';$('#w2').classList.add('show')},RM?0:8200))};
function constel(){var c=$('#con'),g=c.getContext('2d');c.width=innerWidth;c.height=innerHeight;var w=c.width,h=c.height,P=[[.18,.62],[.3,.4],[.42,.55],[.52,.3],[.64,.46],[.75,.25],[.84,.5]].map(function(p){return[p[0]*w,p[1]*h*.8]}),t=0,id=wt.length;function f(){g.clearRect(0,0,w,h);t+=RM?100:1;var k=t/50;g.strokeStyle='#C8A66A';g.fillStyle='#F5EBDD';g.lineWidth=1;for(var i=0;i<P.length;i++){if(k>i){g.globalAlpha=.9;g.shadowColor='#C8A66A';g.shadowBlur=18;g.beginPath();g.arc(P[i][0],P[i][1],3.5,0,7);g.fill();g.shadowBlur=0}if(i&&k>i){var p=Math.min(1,k-i);g.globalAlpha=.55;g.beginPath();g.moveTo(P[i-1][0],P[i-1][1]);g.lineTo(P[i-1][0]+(P[i][0]-P[i-1][0])*p,P[i-1][1]+(P[i][1]-P[i-1][1])*p);g.stroke()}}if(!$('#wishOv').hidden&&!RM)requestAnimationFrame(f)}f()}
/* restart */
$('#restart').onclick=function(){closeWish();$('#main').hidden=true;$('#nav').hidden=true;var i=$('#intro');i.style.display='';void i.offsetWidth;scrollTo(0,0);intro()};
intro();
})();
