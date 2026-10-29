/* Case-study top bar + "More work" footer. Configure with window.CSN before loading this file.
   CSN.variant: "a" minimal bar · "b" bar + progress line · "c" current section in the bar · "d" floating section pill · "e" floating section rail, bottom-left */
(function(){
var C=window.CSN; if(!C) return;
var V=C.variant||'b';
try{var q=location.search.match(/[?&]nav=([abcde])/);if(q)V=q[1];else if(window.CSN_DEMO)V=localStorage.getItem('csn-variant')||V;}catch(e){}
var T=C.theme==='light'
  ?{bg:'#F4F4F2',line:'#E4E3DF',ink:'#1A1A1A',muted:'#6F6C66',dim:'#A19E97',pill:'#E9E8E4'}
  :{bg:'#0B0B0C',line:'#232326',ink:'#F3EFE8',muted:'#9A9A96',dim:'#666663',pill:'#1C1C1E'};
if(C.side) T.bg=C.side; if(C.line) T.line=C.line;
var root=document.documentElement;
[['bg',T.bg],['line',T.line],['ink',T.ink],['muted',T.muted],['dim',T.dim],['pill',T.pill],['accent',C.accent],['ai',C.accentInk||'#fff']].forEach(function(p){root.style.setProperty('--c-'+p[0],p[1]);});
root.classList.add('csn-on','csn-v-'+V);
var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
function pad(n){return (n<10?'0':'')+n;}
var chev='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
var back='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 12H5M11 6l-6 6 6 6"/></svg>';
var secs=(C.sections||[]).map(function(s){return {el:document.getElementById(s[0]),id:s[0],label:s[1]};}).filter(function(s){return s.el;});

/* ---------- top bar ---------- */
var bar=document.createElement('header'); bar.className='csn-bar';
bar.innerHTML='<div class="csn-l"><a class="csn-mark" href="'+C.home+'" aria-label="Orey Xia, home">OX<i>.</i></a>'+
  '<a class="csn-crumb" href="'+C.back+'">'+back+'<span>All work</span></a></div>'+
  '<nav class="csn-r" aria-label="Site"><a href="'+C.back+'">Work</a><a href="'+(C.about||C.home.replace(/index\.html$/,'')+'about/index.html')+'">About</a><a href="'+C.home+'#contact">Contact</a></nav>'+
  ((V==='b'||V==='c')?'<span class="csn-line" aria-hidden="true"></span>':'');
document.body.insertBefore(bar,document.body.firstChild);
var line=bar.querySelector('.csn-line');

function menuHTML(){return '<ul class="csn-menu" role="list">'+secs.map(function(s,i){return '<li><a href="#'+s.id+'" data-i="'+i+'"><b>'+pad(i+1)+'</b><span>'+s.label+'</span></a></li>';}).join('')+'</ul>';}
function wireMenu(btn,menu){
  btn.addEventListener('click',function(e){e.stopPropagation();var o=!menu.classList.contains('open');menu.classList.toggle('open',o);btn.setAttribute('aria-expanded',o);});
  document.addEventListener('click',function(){menu.classList.remove('open');btn.setAttribute('aria-expanded','false');});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){menu.classList.remove('open');btn.setAttribute('aria-expanded','false');}});
  menu.addEventListener('click',function(e){var a=e.target.closest('a');if(!a)return;e.preventDefault();go(+a.dataset.i);menu.classList.remove('open');btn.setAttribute('aria-expanded','false');});
}
function go(i){var s=secs[i];if(!s)return;var y=s.el.getBoundingClientRect().top+window.scrollY-(V==='c'?bar.offsetHeight:0)+1;window.scrollTo({top:y,behavior:reduce?'auto':'smooth'});}

/* c: current section label in the bar */
var secBtn=null,secMenu=null;
if(V==='c'&&secs.length){
  var w=document.createElement('div');w.className='csn-sec';
  w.innerHTML='<button type="button" class="csn-secbtn" aria-haspopup="true" aria-expanded="false"><b>00</b><span class="t"><span>'+C.title+'</span></span>'+chev+'</button>'+menuHTML();
  bar.appendChild(w); secBtn=w.querySelector('.csn-secbtn'); secMenu=w.querySelector('.csn-menu'); wireMenu(secBtn,secMenu);
}

/* d: floating pill */
var pill=null,ringFg=null,pLabel=null,pPrev=null,pNext=null,pMenu=null,RC=2*Math.PI*9;
if(V==='d'&&secs.length){
  pill=document.createElement('div');pill.className='csn-pill';pill.setAttribute('role','navigation');pill.setAttribute('aria-label','Case study sections');
  pill.innerHTML='<button type="button" class="nav prev" aria-label="Previous section"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg></button>'+
    '<button type="button" class="cur" aria-haspopup="true" aria-expanded="false"><svg class="csn-ring" viewBox="0 0 22 22" aria-hidden="true"><circle class="bg" cx="11" cy="11" r="9"/><circle class="fg" cx="11" cy="11" r="9" stroke-dasharray="'+RC+'" stroke-dashoffset="'+RC+'"/></svg><span class="t">'+C.title+'</span></button>'+
    '<button type="button" class="nav next" aria-label="Next section"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg></button>'+menuHTML();
  document.body.appendChild(pill);
  ringFg=pill.querySelector('.fg');pLabel=pill.querySelector('.cur .t');pPrev=pill.querySelector('.prev');pNext=pill.querySelector('.next');pMenu=pill.querySelector('.csn-menu');
  wireMenu(pill.querySelector('.cur'),pMenu);
  pPrev.addEventListener('click',function(){go(Math.max(0,cur-1));});
  pNext.addEventListener('click',function(){go(Math.min(secs.length-1,cur+1));});
}

/* e: floating section rail, bottom-left (the old sidebar list, without the sidebar) */
var rail=null,railInd=null,railLinks=[];
if(V==='e'&&secs.length){
  rail=document.createElement('nav');rail.className='csn-rail';rail.setAttribute('aria-label','Case study sections');
  rail.innerHTML='<ol><li class="ind" aria-hidden="true"></li>'+secs.map(function(s,i){return '<li><a href="#'+s.id+'" data-i="'+i+'"><span class="n">'+pad(i+1)+'</span><span class="l">'+s.label+'</span></a></li>';}).join('')+'</ol>';
  document.body.appendChild(rail);
  railInd=rail.querySelector('.ind');railLinks=[].slice.call(rail.querySelectorAll('a'));
  rail.addEventListener('click',function(e){var a=e.target.closest('a');if(!a)return;e.preventDefault();go(+a.dataset.i);});
}
function placeRail(){ if(!rail||!railLinks.length) return;
  var c=function(a){return a.parentNode.offsetTop+a.offsetHeight/2;}, c0=c(railLinks[0]);
  rail.style.setProperty('--c0',c0+'px'); rail.style.setProperty('--span',(c(railLinks[railLinks.length-1])-c0)+'px');
  railInd.style.transform='translateY('+c0+'px)'; railInd.style.height=(cur>=0?c(railLinks[cur])-c0:0)+'px'; }

/* ---------- More work footer ---------- */
var base=C.home.replace(/index\.html$/,'');
var P=[
  {id:'learnvia',href:'learnvia/index.html',img:'img/learnvia-cover.webp',k:'Adaptive AI tutor · 38% vs. 14% learner recovery',t:'Learnvia AI Tutor'},
  {id:'verifier',href:'verifier/index.html',img:'img/verifier-cover.webp',k:'Source-grounded answers · unsupported claims cut from 2 to 0',t:'Answer Verifier'},
  {id:'ancestor',href:'ancestor/index.html',img:'img/ancestor.webp',k:'AI-assisted memory curation for family storytelling',t:'Ancestor'},
  {id:'bumble',href:'bumble/index.html',img:'img/bumble-cover.webp',k:'AI-mediated conversation design for early-match engagement',t:'Bumble DeepSync'},
  {id:'pivot',href:'pivot/index.html',img:'img/pivot-cover.webp',k:'Decision support for low-budget meal planning',t:'Pivot'}
];
var me=-1;P.forEach(function(p,i){if(location.pathname.indexOf('/'+p.id+'/')>-1)me=i;});
if(me>-1&&C.more!==false){
  var picks=[P[(me+1)%P.length],P[(me+2)%P.length]];
  var more=document.createElement('section');more.className='csn-more';more.setAttribute('aria-label','More work');
  more.innerHTML='<div class="in"><div class="hd"><h2>More <i>work</i></h2><a class="all" href="'+C.back+'">All work →</a></div><div class="grid">'+
    picks.map(function(p){return '<a class="card" href="'+base+p.href+'"><div class="img"><img src="'+base+p.img+'" alt="" loading="lazy"></div><p class="k">'+p.k+'</p><h3>'+p.t+'</h3></a>';}).join('')+
    '</div><div class="ft"><span>© 2026 Orey Xia</span><a href="'+C.home+'">oreyxia.com</a></div></div>';
  var scripts=document.body.querySelector('script');
  document.body.insertBefore(more,scripts||null);
}

/* ---------- scroll behaviour ---------- */
var cur=-2,lastY=window.scrollY;
function setCur(i){ if(i===cur) return; var prev=cur; cur=i;
  var label=i<0?C.title:secs[i].label, num=i<0?'00':pad(i+1);
  if(secBtn){
    secBtn.querySelector('b').textContent=num;
    var box=secBtn.querySelector('.t'), old=box.lastElementChild, nu=document.createElement('span'), down=i>prev;
    nu.textContent=label; if(!reduce){nu.style.position='absolute';nu.style.inset='0';nu.style.transform='translateY('+(down?100:-100)+'%)';nu.style.opacity='0';}
    box.appendChild(nu);
    if(reduce){old.remove();}else{requestAnimationFrame(function(){requestAnimationFrame(function(){nu.style.transform='';nu.style.opacity='';old.style.transform='translateY('+(down?-100:100)+'%)';old.style.opacity='0';});});
      setTimeout(function(){if(old.parentNode)old.remove();nu.style.position='';nu.style.inset='';},420);}
  }
  if(pill){pLabel.textContent=(i<0?'':pad(i+1)+'  ')+label;pPrev.disabled=i<=0;pNext.disabled=i>=secs.length-1;}
  railLinks.forEach(function(a,j){a.classList.toggle('on',j===i);a.classList.toggle('done',j<i);if(j===i)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');}); placeRail();
  [secMenu,pMenu].forEach(function(m){if(!m)return;[].forEach.call(m.querySelectorAll('a'),function(a,j){a.classList.toggle('on',j===i);});});
}
function onScroll(){
  var y=window.scrollY, max=document.documentElement.scrollHeight-window.innerHeight, p=max>0?Math.min(1,Math.max(0,y/max)):0;
  bar.classList.toggle('scrolled',y>8);
  if(V!=='c'){ if(y>lastY+4&&y>240) bar.classList.add('hide'); else if(y<lastY-4) bar.classList.remove('hide'); }
  lastY=y;
  if(line) line.style.width=(p*100)+'%';
  var probe=window.innerHeight*.35,i=-1; secs.forEach(function(s,j){if(s.el.getBoundingClientRect().top<=probe)i=j;}); setCur(i);
  if(pill){pill.classList.toggle('show',y>window.innerHeight*.6&&y<max-40); ringFg.style.strokeDashoffset=RC*(1-p);}
  if(rail){var mw=document.querySelector('.csn-more'),hit=mw&&mw.getBoundingClientRect().top<window.innerHeight-40; rail.classList.toggle('show',y>window.innerHeight*.4&&!hit);}
}
var tk=false;window.addEventListener('scroll',function(){if(!tk){tk=true;requestAnimationFrame(function(){tk=false;onScroll();});}},{passive:true});
window.addEventListener('resize',function(){placeRail();onScroll();});
(document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(placeRail);
onScroll();
})();
