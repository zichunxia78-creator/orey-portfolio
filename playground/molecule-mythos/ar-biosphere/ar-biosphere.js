/* AR Biosphere illustration — drop-in behaviour. Works for every <figure class="ar-illo" data-ar-biosphere>. */
(function(){
  var MODES=['carbon','water','light'], NAMES={carbon:'Carbon',water:'Water',light:'Light'};
  var READY=8600, FIRST_SWITCH=4500, EVERY=7000;
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  function init(el){
    if(el.__arb) return; el.__arb=true;
    var btns=[].slice.call(el.querySelectorAll('.ar-modes button'));
    var tagEl=el.querySelector('.ar-tag b'), hit=el.querySelector('.ar-panel-hit');
    var timers=[], auto=null, userPicked=false, played=false;
    function tag(t){ if(!tagEl||tagEl.textContent===t) return; tagEl.classList.add('swap'); setTimeout(function(){ tagEl.textContent=t; tagEl.classList.remove('swap'); },250); }
    function setMode(m){ el.setAttribute('data-mode',m); if(el.classList.contains('ready')) tag(NAMES[m]);
      btns.forEach(function(b){ b.setAttribute('aria-pressed', String(b.getAttribute('data-m')===m)); }); }
    function cur(){ return el.getAttribute('data-mode')||'carbon'; }
    function next(){ setMode(MODES[(MODES.indexOf(cur())+1)%3]); }
    function stopAuto(){ if(auto){ clearInterval(auto); auto=null; } }
    function pick(m){ userPicked=true; stopAuto(); timers.forEach(clearTimeout); timers=[]; played=true; el.classList.add('is-in','ready'); setMode(m); tag(NAMES[m]); }
    function play(){
      if(played) return; played=true;
      el.classList.add('is-in');
      if(reduce){ el.classList.add('ready'); tag(NAMES[cur()]); return; }
      timers.push(setTimeout(function(){ tag('Linking'); }, 500));
      timers.push(setTimeout(function(){ tag('Restoring'); }, 3300));
      timers.push(setTimeout(function(){ el.classList.add('ready'); tag(NAMES[cur()]); }, READY));
      timers.push(setTimeout(function(){ if(!userPicked){ next(); auto=setInterval(next, EVERY); } }, READY+FIRST_SWITCH));
    }
    el.arbReplay=function(){ stopAuto(); timers.forEach(clearTimeout); timers=[]; userPicked=false; played=false;
      el.classList.remove('is-in','ready'); setMode('carbon'); if(tagEl) tagEl.textContent='Standby'; void el.offsetWidth; play(); };
    if(hit) hit.addEventListener('click',function(){ pick(MODES[(MODES.indexOf(cur())+1)%3]); });
    btns.forEach(function(b){ b.addEventListener('click',function(){ pick(b.getAttribute('data-m')); }); });
    if(!('IntersectionObserver' in window)){ play(); return; }
    // start once when 35% visible; pause looping animations while off-screen
    new IntersectionObserver(function(es){ es.forEach(function(e){
      if(e.isIntersecting && e.intersectionRatio>=0.35) play();
      el.classList.toggle('ar-offscreen', !e.isIntersecting);
    }); },{threshold:[0,0.35]}).observe(el);
  }
  function boot(){ [].forEach.call(document.querySelectorAll('.ar-illo[data-ar-biosphere]'), init); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  window.ARBiosphere={ init:init, boot:boot };
})();
