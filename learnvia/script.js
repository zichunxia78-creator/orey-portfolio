var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ─── nav solid on scroll ─── */
var navEl = document.getElementById("nav");
window.addEventListener("scroll", function(){
  if (navEl) navEl.classList.toggle("solid", window.scrollY > 60);
}, { passive: true });

/* ─── scroll-spy nav highlighting ─── */
(function(){
  var links = [].slice.call(document.querySelectorAll(".nav-links a"));
  var sections = links.map(function(a){
    var id = a.getAttribute("href").replace("#","");
    return document.getElementById(id);
  }).filter(Boolean);

  function update(){
    var mid = window.innerHeight * 0.38;
    var best = -1;
    for (var i = 0; i < sections.length; i++){
      var r = sections[i].getBoundingClientRect();
      if (r.top <= mid) best = i;
    }
    links.forEach(function(a, k){
      a.classList.toggle("active", k === best);
    });
  }
  window.addEventListener("scroll", update, { passive: true });
  update();
})();

/* ─── section reveal on scroll ─── */
(function(){
  var els = [].slice.call(document.querySelectorAll(".rv"));
  if (reduced || !("IntersectionObserver" in window)) {
    els.forEach(function(el){ el.classList.add("rv-in"); });
    return;
  }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if (e.isIntersecting) { e.target.classList.add("rv-in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  els.forEach(function(el){ io.observe(el); });
})();

/* ─── stat counter animation ─── */
(function(){
  var counters = [].slice.call(document.querySelectorAll("[data-count]"));
  if (!counters.length) return;

  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function animateCounter(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var format = el.getAttribute("data-format");
    var duration = 1600;
    var start = null;

    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var val = easeOut(progress) * target;

      if (format === "comma") {
        el.textContent = Math.round(val).toLocaleString();
      } else if (format === "alpha") {
        el.textContent = "α " + val.toFixed(2);
      } else {
        el.textContent = Math.round(val).toLocaleString();
      }

      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if (reduced || !("IntersectionObserver" in window)) {
    counters.forEach(function(el) {
      var target = parseFloat(el.getAttribute("data-count"));
      var format = el.getAttribute("data-format");
      if (format === "comma") el.textContent = Math.round(target).toLocaleString();
      else if (format === "alpha") el.textContent = "α " + target.toFixed(2);
    });
    return;
  }

  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if (e.isIntersecting) {
        animateCounter(e.target);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(function(el){ io.observe(el); });
})();

/* ─── pipeline walkthrough (ported from original LOCAI) ─── */
(function(){
  var pipe = document.getElementById("pipe");
  if (!pipe) return;
  var STAGES = [
    { label: "Tutor–learner conversations", phase: "Input", tone: "input", blurb: "Raw message data from Calculus I tutor sessions — the input to everything downstream." },
    { label: "Coding schema", phase: "Spring", tone: "spring", blurb: "Each turn is tagged against learning-science constructs like productive struggle and instructional effectiveness." },
    { label: "Human coding + IRR", phase: "Spring", tone: "spring", blurb: "Raters code independently; calibration rounds push inter-rater reliability until the framework is stable." },
    { label: "LLM coding pipeline", phase: "Summer", tone: "summer", blurb: "A validated LLM coder reproduces human judgments, scaling coding to thousands of conversations." },
    { label: "Learner transition analysis", phase: "Summer", tone: "summer", blurb: "We trace where learners go after signaling confusion: continued struggle, an engagement fork, or recovery toward the tutor." },
    { label: "Recommendations", phase: "Summer", tone: "summer", blurb: "Data-driven guidance for refining the AI tutor — which loops back into the platform." }
  ];
  var scenes = [].slice.call(pipe.querySelectorAll(".scene"));
  var dots = [].slice.call(pipe.querySelectorAll(".dot"));
  var segs = [].slice.call(pipe.querySelectorAll(".seg"));
  var capTitle = document.getElementById("capTitle"), phase = document.getElementById("phase"),
      blurb = document.getElementById("blurb"), pp = document.getElementById("pp");
  var cur = 0, paused = false, timer = null;

  function show(i){
    cur = i;
    scenes.forEach(function(s,k){ s.classList.toggle("on", k===i); });
    dots.forEach(function(d,k){ d.classList.toggle("on", k===i); });
    segs.forEach(function(s,k){ s.classList.toggle("on", k<i); });
    var s = STAGES[i];
    capTitle.textContent = s.label; phase.textContent = s.phase;
    phase.className = "phase tone-" + s.tone; blurb.textContent = s.blurb;
  }

  function tick(){ show((cur+1)%STAGES.length); }
  function setTimer(){ clearInterval(timer); if (!paused && !reduced) timer = setInterval(tick, 3400); }

  function setPaused(v){
    paused = v;
    pp.innerHTML = v
      ? '<svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M8 5v14l11-7z"/></svg><span>Play</span>'
      : '<svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg><span>Pause</span>';
    setTimer();
  }

  dots.forEach(function(d){ d.addEventListener("click", function(){ setPaused(true); show(+d.dataset.i); }); });
  document.getElementById("next").addEventListener("click", function(){ setPaused(true); show((cur+1)%STAGES.length); });
  document.getElementById("prev").addEventListener("click", function(){ setPaused(true); show((cur+STAGES.length-1)%STAGES.length); });
  pp.addEventListener("click", function(){ setPaused(!paused); });

  show(0); setPaused(false);
})();

/* ─── confusion loop: sequenced reveal + hover emphasis (ported from original LOCAI) ─── */
(function(){
  var d = document.querySelector(".cl2-diagram");
  if (!d) return;
  if (reduced || !("IntersectionObserver" in window)) { d.classList.add("play","settled"); }
  else {
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){ if (e.isIntersecting){ d.classList.add("play"); io.disconnect(); setTimeout(function(){ d.classList.add("settled"); }, 1700); } });
    }, { threshold: 0.3 });
    io.observe(d);
  }
  function bind(sel, cls){
    var n = d.querySelector(sel);
    if (!n) return;
    n.addEventListener("mouseenter", function(){ d.classList.add(cls); });
    n.addEventListener("mouseleave", function(){ d.classList.remove(cls); });
  }
  bind(".cl2-reinf", "emph-reinf");
  bind(".cl2-recov", "emph-recov");
  bind(".cl2-reengage", "emph-recov");
})();

/* ─── scroll-rotate flower icon ─── */
(function(){
  var flower = document.getElementById("scrollFlower");
  if (!flower || reduced) return;
  window.addEventListener("scroll", function(){
    flower.style.transform = "rotate(" + (window.scrollY * 0.1) + "deg)";
  }, { passive: true });
})();

/* ─── reduced motion: pause hero ─── */
if (reduced) {
  var amb = document.getElementById("amb");
  if (amb && amb.pauseAnimations) amb.pauseAnimations();
}
