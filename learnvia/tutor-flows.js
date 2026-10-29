/* 07 · The tutor in context: three annotated flows inside a Learnvia-style course page */
(function(){
var root=document.getElementById('tf'); if(!root) return;
var chat=document.getElementById('tfChat'), notesEl=document.getElementById('tfNotes'),
    wires=document.getElementById('tfWires'), stage=document.getElementById('tfStage'),
    outcome=document.getElementById('tfOutcome'), tabs=[].slice.call(root.querySelectorAll('[role="tab"]'));
var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;

function chips(list,on){return '<div class="tf-chips">'+list.map(function(c){return '<span'+(c===on?' class="on"':'')+'>'+c+'</span>';}).join('')+'</div>';}
function math(t){return '<span class="tf-math">'+t+'</span>';}
var ok='<svg class="tf-ok" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M12 1l2.9 3.3 4.3-.6.6 4.3L23 12l-3.2 3-.6 4.3-4.3.6L12 23l-2.9-3.1-4.3.6-.6-4.3L1 12l3.2-3 .6-4.3 4.3-.6z" style="fill:var(--lv-blue)"/><path d="M8.5 12.5l2 2 5-5" stroke="#FFFFFF" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';

/* who: s = student, t = tutor. n: which note (1–3) points at this message */
var FLOWS=[
 {msgs:[
   {who:'s',html:"I don't get it.",n:[1,2]},
   {who:'t',html:"Let's pinpoint what feels unclear."+chips(['Problem goal','Which rule','First step','Specific term'],'Which rule'),n:[3]},
   {who:'s',html:"Which rule"},
   {who:'t',html:"Which rule lets us integrate the two terms separately?"+chips(['Sum / difference rule','Product rule','Chain rule'])}
  ],
  notes:[
   {k:'signal',h:'Learner signal',b:"“I don't get it.” Confusion with no target: the learner can't yet say what's unclear.",tag:'Code: Signals confusion'},
   {k:'ai',h:'Codebook interpretation',b:'The first confusion code in this exchange, with no attempt yet. There is nothing to repair, so the next move should help the learner locate the gap rather than explain the whole problem.',tag:'Clarify before explaining'},
   {k:'resp',h:'Tutor response',b:'Narrow it down instead of explaining. Four entry points let the learner name the gap themselves.',tag:'Rec 01 · Intervene early'}
  ],
  out:"The learner picks “Which rule” and answers the follow-up. The tutor never had to hand over the solution."},
 {msgs:[
   {who:'s',html:"I still don't get it.",n:[1]},
   {who:'t',html:"Let's isolate one part."+math('∫ 3 sin(x) dx = ?')},
   {who:'s',html:"3cos(x)",n:[2]},
   {who:'t',html:"Almost — right function, but check the sign."+math('(d/dx) cos(x) = −sin(x)')+'<span class="tf-q">What differentiates to +sin(x)?</span>'+chips(['−cos(x)','cos(x)'],'−cos(x)'),n:[3]}
  ],
  notes:[
   {k:'signal',h:'Learner signal',b:'The same confusion again, right after a support move.',tag:'Code: Repeats input'},
   {k:'ai',h:'Codebook interpretation',b:'A second confusion code right after support marks the start of a continued-struggle loop. The attempt also shows one specific misconception: the sign of ∫ sin(x).',tag:'Continued struggle'},
   {k:'resp',h:'Tutor response',b:'Isolate one term. Affirm what is right (the function) and repair only the sign.',tag:'Rec 02 · Rec 06'}
  ],
  out:"The learner chooses −cos(x) and reaches ∫ 3 sin(x) dx = −3 cos(x) + C on their own."},
 {msgs:[
   {who:'s',html:"I don't know — I've been struggling with this.",n:[1,2]},
   {who:'t',html:"You've been working through a difficult step. Let's make it smaller."+'<div class="tf-levels"><span>Small hint</span><span class="on">Show one step</span><span>Explain this part</span></div>'+math('∫ 3 sin(x) dx = 3 · (−cos(x)) = −3 cos(x)'),n:[3]},
   {who:'s',html:"−3 cos(x)"},
   {who:'t',html:'<span class="tf-okline">'+ok+'That step is correct.</span>Now try the next part.'+math('∫ 2 cos(x) dx = ?'),win:true}
  ],
  notes:[
   {k:'signal',h:'Learner signal',b:'Frustration after several struggle turns. This is affect, not just confusion.',tag:'Code: Signals confusion · sustained'},
   {k:'ai',h:'Codebook interpretation',b:'Sustained confusion plus frustration: the point where conversations fork toward answer-seeking or dropping off. In the data, 42.5% of struggle conversations ended with the learner still stuck.',tag:'Engagement fork'},
   {k:'resp',h:'Tutor response',b:'Acknowledge the effort, let the learner choose how much help, then hand the next step back.',tag:'Rec 05 · Rec 03'}
  ],
  out:"The learner re-engages: one worked step, then an independent attempt at the next part."}
];

var T=[]; function later(fn,ms){var t=setTimeout(fn,ms);T.push(t);} function clear(){T.forEach(clearTimeout);T=[];}

var cur=0, hold=false, visible=false, HOLD_MS=3800;
function render(fi){
  clear(); var F=FLOWS[fi]; cur=fi;
  tabs.forEach(function(b,i){b.setAttribute('aria-selected',i===fi);b.classList.remove('run');});
  chat.innerHTML=F.msgs.map(function(m,i){
    var marks=(m.n||[]).map(function(n){return '<i class="tf-mk k'+n+'" data-n="'+n+'">'+n+'</i>';}).join('');
    return '<div class="tf-msg '+(m.who==='s'?'s':'t')+(m.win?' win':'')+(marks?' has-mk':'')+'" data-i="'+i+'">'+marks+(m.who==='t'?'<div class="tf-thumbs" aria-hidden="true">'+thumbs+'</div>':'')+'<div class="tf-txt">'+m.html+'</div></div>';
  }).join('');
  notesEl.innerHTML=F.notes.map(function(n,i){return '<article class="tf-note '+n.k+'" data-n="'+(i+1)+'"><p class="tf-nh"><i>'+(i+1)+'</i>'+n.h+'</p><p class="tf-nb">'+n.b+'</p><span class="tf-tag">'+n.tag+'</span></article>';}).join('');
  outcome.innerHTML='<b>Outcome</b>'+F.out;
  var msgs=[].slice.call(chat.children), notes=[].slice.call(notesEl.children);
  wires.innerHTML='';
  if(reduce){msgs.concat(notes).forEach(function(e){e.classList.add('in');});outcome.classList.add('in');draw();return;}
  outcome.classList.remove('in');
  var t=150;
  msgs.forEach(function(m,i){
    later(function(){m.classList.add('in'); chat.scrollTo({top:chat.scrollHeight,behavior:'smooth'});
      (FLOWS[fi].msgs[i].n||[]).forEach(function(n,j){later(function(){notes[n-1].classList.add('in');draw();},260+j*220);});
      draw();
    },t); t+= (FLOWS[fi].msgs[i].who==='s'?650:1100);
  });
  later(function(){outcome.classList.add('in');},t);
  later(draw,t+500);
  /* auto-advance to the next flow, like the original prototype's autoplay */
  var tab=tabs[fi]; tab.style.setProperty('--dur',(t+HOLD_MS)+'ms'); void tab.offsetWidth; tab.classList.add('run');
  later(function tick(){ if(hold||!visible){ later(tick,500); return; } render((cur+1)%FLOWS.length); }, t+HOLD_MS);
}
var thumbs='<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M7 10v11M15 5.9L14 10h5.8a2 2 0 0 1 1.9 2.6l-2.3 7A2 2 0 0 1 17.5 21H7V10l4.5-7A2.5 2.5 0 0 1 15 5.9z"/></svg><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" style="transform:scaleY(-1)"><path d="M7 10v11M15 5.9L14 10h5.8a2 2 0 0 1 1.9 2.6l-2.3 7A2 2 0 0 1 17.5 21H7V10l4.5-7A2.5 2.5 0 0 1 15 5.9z"/></svg>';

/* dashed connectors from a marked message to its note card */
function draw(){
  if(getComputedStyle(wires).display==='none') return;
  var sb=stage.getBoundingClientRect(); wires.setAttribute('viewBox','0 0 '+sb.width+' '+sb.height);
  var h='';
  [].forEach.call(notesEl.querySelectorAll('.tf-note.in'),function(note){
    var n=note.dataset.n, mk=chat.querySelector('.tf-msg.in .tf-mk[data-n="'+n+'"]'); if(!mk) return;
    var a=mk.getBoundingClientRect(), b=note.getBoundingClientRect(), cr=chat.getBoundingClientRect();
    if(a.top+a.height/2<cr.top||a.top+a.height/2>cr.bottom) return;
    var x1=a.right-sb.left+4, y1=a.top+a.height/2-sb.top, x2=b.left-sb.left-6, y2=b.top+22-sb.top, mx=x1+Math.max(24,(x2-x1)*.45);
    h+='<path class="k'+n+'" d="M'+x1+','+y1+' C'+mx+','+y1+' '+mx+','+y2+' '+x2+','+y2+'"/><circle class="k'+n+'" cx="'+x2+'" cy="'+y2+'" r="3"/>';
  });
  wires.innerHTML=h;
}

tabs.forEach(function(b,i){
  b.addEventListener('click',function(){render(i);});
  b.addEventListener('keydown',function(e){var d=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0;if(!d)return;e.preventDefault();var j=(i+d+tabs.length)%tabs.length;tabs[j].focus();render(j);});
});
document.getElementById('tfReplay').addEventListener('click',function(){var i=0;tabs.forEach(function(b,j){if(b.getAttribute('aria-selected')==='true')i=j;});render(i);});
window.addEventListener('resize',draw);
notesEl.addEventListener('transitionend',draw);chat.addEventListener('transitionend',draw);
chat.addEventListener('scroll',draw,{passive:true});

/* start when the component scrolls into view */
var started=false;
function start(){if(started)return;started=true;render(0);}
function sync(){root.classList.toggle('tf-paused',hold||!visible);}
stage.addEventListener('mouseenter',function(){hold=true;sync();});
stage.addEventListener('mouseleave',function(){hold=false;sync();});
root.addEventListener('focusin',function(){hold=true;sync();});
root.addEventListener('focusout',function(){hold=false;sync();});
if(!('IntersectionObserver' in window)){visible=true;start();}
else{new IntersectionObserver(function(es){es.forEach(function(e){visible=e.isIntersecting;sync();if(visible)start();});},{threshold:.25}).observe(root);}
})();
