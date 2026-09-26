/* Case-study sidebar. Configure with window.CSN before loading this file. */
(function(){
var C=window.CSN; if(!C) return;
var T=C.theme==='light'
  ?{bg:'#F4F4F2',line:'#E4E3DF',ink:'#1A1A1A',muted:'#6F6C66',dim:'#A19E97',pill:'#E9E8E4',hov:'rgba(245,198,214,.55)',hovt:'#1A1A1A'}
  :{bg:'#111216',line:'#23242A',ink:'#F3EFE8',muted:'#8E8C88',dim:'#5E5D5A',pill:'#1C1D22',hov:'rgba(245,198,214,.12)',hovt:'#F5C6D6'};
if(C.side) T.bg=C.side; if(C.line) T.line=C.line;
function pad(n){return (n<10?'0':'')+n;}
var arrowL='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 12H5M11 6l-6 6 6 6"/></svg>';
var arrowR='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6"/></svg>';
var mark='<svg viewBox="0 0 100 100" width="24" height="24" aria-hidden="true"><rect x="44" y="6" width="12" height="88" rx="6"/><rect x="44" y="6" width="12" height="88" rx="6" transform="rotate(60 50 50)"/><rect x="44" y="6" width="12" height="88" rx="6" transform="rotate(120 50 50)"/><circle cx="50" cy="50" r="7"/></svg>';
var links2='<nav class="csn-links" aria-label="Site"><a href="'+C.home+'">Home</a><a href="'+C.back+'">'+(C.backLabel||'Projects')+'</a></nav>';
var secs=C.sections.map(function(s){return {el:document.getElementById(s[0]),id:s[0],label:s[1]};}).filter(function(s){return s.el;});
var el=document.createElement('aside'); el.className='csn'; el.setAttribute('aria-label','Case study navigation');
[['bg',T.bg],['line',T.line],['ink',T.ink],['muted',T.muted],['dim',T.dim],['pill',T.pill],['hov',T.hov],['hovt',T.hovt],['accent',C.accent],['ai',C.accentInk||'#fff']].forEach(function(p){el.style.setProperty('--c-'+p[0],p[1]);});
el.innerHTML=
 '<div class="csn-top"><a class="csn-mark" href="'+C.home+'" aria-label="Orey Xia, home">'+mark+'</a>'+links2+'</div>'+
 '<div class="csn-proj"><p class="csn-eyebrow">'+C.eyebrow+'</p><h2 class="csn-title">'+C.title+'</h2><div class="csn-prog"><span class="b"><i></i></span><span class="pct">0%</span></div></div>'+
 '<nav aria-label="Sections"><ul class="csn-nav"><li class="csn-ind" aria-hidden="true"></li>'+
   secs.map(function(s,i){return '<li><a href="#'+s.id+'"><span class="csn-n">'+pad(i+1)+'</span><span>'+s.label+'</span></a></li>';}).join('')+'</ul></nav>'+
 (C.next?'<a class="csn-next" href="'+C.next.href+'"><small>'+(C.next.kicker||'Next project')+'</small><b><span>'+C.next.label+'</span><i class="csn-go">'+arrowR+'</i></b></a>':'')+
 '<div class="csn-m"><div class="row"><a class="csn-mark" href="'+C.home+'" aria-label="Orey Xia, home">'+mark+'</a><div class="csn-cur"><span><b>00</b>'+C.title+'</span></div>'+links2.replace('csn-links','csn-links csn-links-m')+'</div><div class="b"><i></i></div></div>';
document.body.insertBefore(el,document.body.firstChild);
document.documentElement.classList.add('csn-on');
var nav=el.querySelector('.csn-nav'),ind=el.querySelector('.csn-ind'),links=[].slice.call(nav.querySelectorAll('a')),cur=-2;
var bars=[].slice.call(el.querySelectorAll('.b i')),pct=el.querySelector('.pct'),mcur=el.querySelector('.csn-cur');
function ctr(a){return a.parentNode.offsetTop+a.offsetHeight/2;}
function place(){ if(!links.length) return; var c0=ctr(links[0]);
  nav.style.setProperty('--c0',c0+'px'); nav.style.setProperty('--span',(ctr(links[links.length-1])-c0)+'px');
  ind.style.transform='translateY('+c0+'px)'; ind.style.height=(cur>=0?ctr(links[cur])-c0:0)+'px'; }
function setCur(i){ if(i===cur) return; var prev=cur; cur=i;
  links.forEach(function(a,j){a.classList.toggle('on',j===i);a.classList.toggle('done',j<i); if(j===i)a.setAttribute('aria-current','location'); else a.removeAttribute('aria-current');});
  place();
  var label=i<0?'<b>00</b>'+C.title:'<b>'+pad(i+1)+'</b>'+secs[i].label, old=mcur.lastElementChild, nu=document.createElement('span'), down=i>prev;
  nu.innerHTML=label; nu.style.transform='translateY('+(down?100:-100)+'%)'; nu.style.opacity='0'; mcur.appendChild(nu);
  requestAnimationFrame(function(){requestAnimationFrame(function(){nu.style.transform='';nu.style.opacity='';old.style.transform='translateY('+(down?-100:100)+'%)';old.style.opacity='0';});});
  setTimeout(function(){if(old.parentNode)old.remove();},450); }
function spy(){ var y=window.innerHeight*.35, i=-1;
  secs.forEach(function(s,j){ if(s.el.getBoundingClientRect().top<=y) i=j; });
  setCur(i);
  var max=document.documentElement.scrollHeight-window.innerHeight, p=max>0?Math.min(1,Math.max(0,window.scrollY/max)):0, w=Math.round(p*100)+'%';
  bars.forEach(function(b){b.style.width=w;}); pct.textContent=w; }
var tk=false; window.addEventListener('scroll',function(){if(!tk){tk=true;requestAnimationFrame(function(){tk=false;spy();});}},{passive:true});
window.addEventListener('resize',function(){place();spy();});
(document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(place);
spy(); place();
})();
