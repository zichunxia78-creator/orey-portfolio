/* 05 · Proposed response policy: clickable / auto-rotating options and working answer checks */
(function(){
var root=document.querySelector('.rp'); if(!root) return;
var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;

/* option groups: click to select; when untouched, rotate through options while visible */
[].forEach.call(root.querySelectorAll('[data-rotate]'),function(card){
  var opts=[].slice.call(card.querySelectorAll('[role="radio"]')), follow=card.querySelector('.rp-follow');
  var i=-1, timer=null, touched=false, visible=false;
  function select(j,user){
    i=j;
    opts.forEach(function(o,k){o.setAttribute('aria-checked',k===j?'true':'false');o.tabIndex=k===j?0:-1;});
    if(follow){follow.classList.remove('in');void follow.offsetWidth;follow.textContent=opts[j].dataset.say;follow.classList.add('in');}
    if(user){touched=true;stop();card.classList.add('picked');}
  }
  function stop(){clearInterval(timer);timer=null;}
  function play(){if(touched||reduce||timer||!visible)return;timer=setInterval(function(){select((i+1)%opts.length);},2200);}
  opts.forEach(function(o,k){
    o.addEventListener('click',function(){select(k,true);});
    o.addEventListener('keydown',function(e){var d=(e.key==='ArrowRight'||e.key==='ArrowDown')?1:(e.key==='ArrowLeft'||e.key==='ArrowUp')?-1:0;if(!d)return;e.preventDefault();var j=(k+d+opts.length)%opts.length;opts[j].focus();select(j,true);});
  });
  card.addEventListener('mouseenter',stop);
  card.addEventListener('mouseleave',play);
  select(card.dataset.rotate==='levels'?1:1);
  if('IntersectionObserver' in window){
    new IntersectionObserver(function(es){es.forEach(function(e){visible=e.isIntersecting;if(visible)play();else stop();});},{threshold:.4}).observe(card);
  }
});

/* answer checks, using the prototype's feedback */
function norm(s){return s.trim().toLowerCase().replace(/\s+/g,'').replace(/[()]/g,'').replace(/[−–]/g,'-');}
var badge='<svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><path d="M12 1l2.9 3.3 4.3-.6.6 4.3L23 12l-3.2 3-.6 4.3-4.3.6L12 23l-2.9-3.1-4.3.6-.6-4.3L1 12l3.2-3 .6-4.3 4.3-.6z" fill="#6359C4"/><path d="M8.5 12.5l2 2 5-5" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
var CHECK={
  s1:function(n){
    if(/^-3cosx?(\+c)?$/.test(n)) return ['ok',badge+' ∫ 3 sin(x) dx = −3 cos(x) + C'];
    if(n.indexOf('-')<0&&/^\+?3?cosx?(\+c)?$/.test(n)) return ['warn','Almost — right function, but check the sign. (d/dx) cos(x) = −sin(x).'];
    return ['err','Not quite. Differentiate your answer to check.'];
  },
  s3:function(n){
    if(/^2sinx?(\+c)?$/.test(n)) return ['ok',badge+' ∫ 2 cos(x) dx = 2 sin(x) + C'];
    if(/^sinx?(\+c)?$/.test(n)) return ['warn','Right antiderivative. What happens to the multiplier 2?'];
    return ['err','Not quite. Differentiate to check.'];
  }
};
[].forEach.call(root.querySelectorAll('.rp-field'),function(f){
  var input=f.querySelector('input'), fb=f.nextElementSibling;
  f.addEventListener('submit',function(e){
    e.preventDefault(); var v=input.value; if(!v.trim()){input.focus();return;}
    var r=CHECK[f.dataset.ans](norm(v)); fb.className='rp-fb '+r[0]; fb.innerHTML=r[1];
  });
});
})();
