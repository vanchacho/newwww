/* ══════════════════════════════════════════════════════════
   ქეთასთვის — app.js
   ══════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var rnd = function (a, b) { return a + Math.random() * (b - a); };

  var canHover = window.matchMedia("(hover:hover)").matches;
  var calm = window.matchMedia("(prefers-reduced-motion:reduce)").matches;

  /* ─── YouTube-ის ვიდეო, თუ ლოკალური mp3 არ არსებობს ─── */
  var YT_ID = "VJ19eCqs4cY"; /* ტექნომაგია — Undersky */

  /* ══════════ ტექსტის დაშლა ══════════ */
  function splitWords(el) {
    var words = el.textContent.trim().split(/\s+/);
    el.textContent = "";
    words.forEach(function (w, i) {
      var s = document.createElement("span");
      s.textContent = w;
      s.style.setProperty("--i", i);
      el.appendChild(s);
      if (i < words.length - 1) el.appendChild(document.createTextNode(" "));
    });
  }
  $$("[data-split]").forEach(splitWords);

  function splitChars(el) {
    var chars = Array.from(el.textContent.trim());
    el.textContent = "";
    chars.forEach(function (c, i) {
      var s = document.createElement("span");
      s.textContent = c;
      s.style.setProperty("--i", i);
      el.appendChild(s);
    });
  }

  /* ══════════ გამოჩენა სქროლზე ══════════ */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add("is-in");
      io.unobserve(e.target);
      if (e.target.hasAttribute("data-count")) countUp(e.target);
    });
  }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });
  $$(".reveal").forEach(function (el) { io.observe(el); });

  /* ══════════ მრიცხველები ══════════ */
  function countUp(box) {
    $$(".fact__num", box).forEach(function (n) {
      var to = parseFloat(n.getAttribute("data-to")) || 0;
      var dec = parseInt(n.getAttribute("data-dec") || "0", 10);
      var t0 = null, dur = 1500;
      if (to === 0) { n.textContent = "0"; return; }
      function tick(t) {
        if (!t0) t0 = t;
        var p = Math.min((t - t0) / dur, 1);
        var e = 1 - Math.pow(1 - p, 3);
        n.textContent = (to * e).toLocaleString("ka-GE", {
          minimumFractionDigits: dec, maximumFractionDigits: dec
        });
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }
  $$(".fact").forEach(function (f) { f.setAttribute("data-count", ""); });

  /* ══════════ მარკიზა ══════════ */
  var PICS = ["01-barcelona", "02-night", "03-sky", "04-sunset",
    "05-mountains", "06-museum-a", "07-museum-b", "08-winter"];
  var WORDS = ["მიყვარხარ", "ქეთა", "ულამაზესო", "ჩემი ადამიანი", "ტექნომაგია", "მარად"];
  var row = $("#marqueeRow");
  if (row) {
    var half = document.createDocumentFragment();
    PICS.forEach(function (p, i) {
      var f = document.createElement("figure");
      var im = document.createElement("img");
      im.src = "img/" + p + ".jpg"; im.alt = ""; im.loading = "lazy";
      f.appendChild(im); half.appendChild(f);
      if (i % 2 === 1) {
        var b = document.createElement("b");
        b.textContent = WORDS[(i / 2) | 0] + " ·";
        half.appendChild(b);
      }
    });
    row.appendChild(half.cloneNode(true));
    row.appendChild(half);
  }

  /* ══════════ ვიზუალიზატორი ══════════ */
  var viz = $("#viz");
  if (viz) {
    for (var v = 0; v < 18; v++) {
      var bar = document.createElement("i");
      bar.style.animationDelay = (-rnd(0, 1)).toFixed(2) + "s";
      bar.style.animationDuration = rnd(0.55, 1.35).toFixed(2) + "s";
      viz.appendChild(bar);
    }
  }

  /* ══════════ მცურავი გულები ══════════ */
  var GLYPHS = ["❤", "♡", "✿", "✦", "❁", "♥"];
  function makeFloaters() {
    var host = $("#floaters");
    if (!host || calm) return;
    for (var i = 0; i < 18; i++) {
      var s = document.createElement("span");
      s.textContent = GLYPHS[(Math.random() * GLYPHS.length) | 0];
      s.style.left = rnd(2, 96).toFixed(1) + "%";
      s.style.fontSize = rnd(10, 26).toFixed(0) + "px";
      s.style.animationDuration = rnd(13, 27).toFixed(1) + "s";
      s.style.animationDelay = (-rnd(0, 14)).toFixed(1) + "s";
      s.style.setProperty("--dx", rnd(-70, 70).toFixed(0) + "px");
      s.style.setProperty("--rot", rnd(-260, 260).toFixed(0) + "deg");
      s.style.opacity = rnd(0.25, 0.7).toFixed(2);
      host.appendChild(s);
    }
  }

  /* ══════════ ბეჭდვის ეფექტი ══════════ */
  var PHRASES = [
    "ჩემი საყვარელი ადამიანი",
    "ჩემი დღის საუკეთესო ნაწილი",
    "ყველაზე ლამაზი შემთხვევითობა, რაც მომხდარა",
    "მიზეზი, რის გამოც ეს გვერდი არსებობს",
    "ერთადერთი, ვისთვისაც ამას ვაკეთებდი"
  ];
  function typeLoop() {
    var out = $("#typed");
    if (!out) return;
    var pi = 0, ci = 0, back = false;
    (function step() {
      var txt = PHRASES[pi];
      out.textContent = txt.slice(0, ci);
      if (!back) {
        if (ci < txt.length) { ci++; setTimeout(step, rnd(48, 105)); }
        else setTimeout(function () { back = true; step(); }, 2100);
      } else {
        if (ci > 0) { ci--; setTimeout(step, 28); }
        else { back = false; pi = (pi + 1) % PHRASES.length; setTimeout(step, 420); }
      }
    })();
  }

  /* ══════════ ნაწილაკები ══════════ */
  function burst(x, y, n) {
    if (calm) return;
    for (var i = 0; i < (n || 12); i++) {
      var h = document.createElement("div");
      h.className = "burst";
      h.textContent = GLYPHS[(Math.random() * GLYPHS.length) | 0];
      h.style.left = x + "px";
      h.style.top = y + "px";
      h.style.setProperty("--bx", rnd(-130, 130).toFixed(0) + "px");
      h.style.setProperty("--by", rnd(-150, -30).toFixed(0) + "px");
      h.style.setProperty("--br", rnd(-180, 180).toFixed(0) + "deg");
      h.style.fontSize = rnd(12, 26).toFixed(0) + "px";
      document.body.appendChild(h);
      setTimeout(function (el) { return function () { el.remove(); }; }(h), 1300);
    }
  }
  function burstFrom(el, n) {
    var r = el.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 2, n);
  }
  function heartRain(n) {
    if (calm) return;
    for (var i = 0; i < (n || 34); i++) {
      (function (i) {
        setTimeout(function () {
          var h = document.createElement("div");
          h.className = "rainheart";
          h.textContent = GLYPHS[(Math.random() * GLYPHS.length) | 0];
          h.style.left = rnd(0, 98).toFixed(1) + "vw";
          h.style.fontSize = rnd(13, 30).toFixed(0) + "px";
          h.style.color = Math.random() > 0.5 ? "var(--rose)" : "var(--gold)";
          h.style.animationDuration = rnd(3.4, 6.4).toFixed(1) + "s";
          h.style.setProperty("--rot", rnd(-300, 300).toFixed(0) + "deg");
          document.body.appendChild(h);
          setTimeout(function () { h.remove(); }, 6600);
        }, i * 90);
      })(i);
    }
  }

  /* კურსორის კვალი */
  if (canHover && !calm) {
    var last = 0;
    window.addEventListener("mousemove", function (e) {
      var now = Date.now();
      if (now - last < 62) return;
      last = now;
      var s = document.createElement("div");
      s.className = "spark";
      s.textContent = Math.random() > 0.72 ? "❤" : "✦";
      s.style.left = e.clientX + "px";
      s.style.top = e.clientY + "px";
      s.style.fontSize = rnd(8, 15).toFixed(0) + "px";
      s.style.opacity = rnd(0.4, 0.9).toFixed(2);
      document.body.appendChild(s);
      setTimeout(function () { s.remove(); }, 980);
    }, { passive: true });
  }

  /* ══════════ მუსიკა ══════════ */
  /* ერთი ფლეერი. ერთი. მეორე ვერ დაიბადება. */
  var audio = $("#audio");
  var playing = false, mode = null, yt = null, busy = false;
  var fade = null;

  function ytFrame() {
    if (yt) return yt; /* მხოლოდ ერთხელ */
    yt = document.createElement("iframe");
    yt.allow = "autoplay; encrypted-media";
    yt.setAttribute("frameborder", "0");
    yt.setAttribute("title", "ტექნომაგია");
    yt.src = "https://www.youtube-nocookie.com/embed/" + YT_ID +
      "?autoplay=1&loop=1&playlist=" + YT_ID +
      "&controls=0&modestbranding=1&playsinline=1" +
      "&enablejsapi=1&rel=0&iv_load_policy=3";
    yt.addEventListener("load", function () { ytCmd("listening", true); });
    $("#ytHost").appendChild(yt);
    return yt;
  }
  function ytCmd(func, isEvent, args) {
    if (!yt || !yt.contentWindow) return;
    var msg = isEvent
      ? { event: func, id: "keta", channel: "widget" }
      : { event: "command", func: func, args: args || [] };
    try { yt.contentWindow.postMessage(JSON.stringify(msg), "*"); } catch (e) {}
  }
  function markPlaying(on) {
    playing = on;
    document.body.classList.toggle("is-playing", on);
    var ico = $("#playIco"), txt = $("#musicTxt");
    if (ico) ico.textContent = on ? "❚❚" : "▶";
    if (txt) txt.textContent = on ? "ტექნომაგია" : "ხმა ჩართე";
  }
  function fadeIn() {
    clearInterval(fade);
    audio.volume = 0;
    var t = 0;
    fade = setInterval(function () {
      t += 0.05;
      audio.volume = Math.min(0.62, t * 0.62);
      if (t >= 1) clearInterval(fade);
    }, 90);
  }
  function play() {
    if (busy || playing) return;
    busy = true;
    if (mode === "yt") {
      ytCmd("playVideo"); markPlaying(true); busy = false; return;
    }
    audio.play().then(function () {
      mode = "audio"; fadeIn(); markPlaying(true); busy = false;
    }).catch(function () {
      mode = "yt"; ytFrame(); markPlaying(true); busy = false;
    });
  }
  function pause() {
    if (mode === "yt") ytCmd("pauseVideo");
    else { clearInterval(fade); audio.pause(); }
    markPlaying(false);
  }
  function toggleMusic() {
    if (busy) return;
    playing ? pause() : play();
  }

  $("#musicBtn").addEventListener("click", toggleMusic);
  $("#playBig").addEventListener("click", function () {
    burstFrom(this, 8); toggleMusic();
  });
  /* გვერდი დაიმალა → ხმა ჩაქრეს, რომ სხვა ჩანართს არ შეერიოს */
  document.addEventListener("visibilitychange", function () {
    if (document.hidden && playing) pause();
  });

  /* ══════════ კარიბჭე ══════════ */
  var gate = $("#gate");
  document.body.classList.add("locked");
  /* ყოველთვის თავიდან: ბრაუზერმა ძველი პოზიცია არ აღადგინოს */
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.scrollTo(0, 0);

  $$(".hcard,.hero__cue").forEach(function (el) {
    el.style.animationPlayState = "paused";
  });

  function openGate() {
    /* ზუსტად თავიდან დაიწყოს, სადაც არ უნდა იყოს გვერდი გასქროლილი */
    var sb = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    setTimeout(function () {
      document.documentElement.style.scrollBehavior = sb || "";
    }, 60);

    gate.classList.add("is-open");
    document.body.classList.remove("locked");
    document.body.classList.add("is-live");
    setTimeout(function () { gate.style.display = "none"; }, 1400);

    $$(".hcard,.hero__cue").forEach(function (el) {
      el.style.animationPlayState = "running";
    });
    splitChars($("#heroName"));
    makeFloaters();
    typeLoop();
    heartRain(30);
    play();
  }
  $("#gateBtn").addEventListener("click", function (e) {
    burst(e.clientX || window.innerWidth / 2, e.clientY || window.innerHeight / 2, 22);
    openGate();
  });

  /* ბარათების პარალაქსი */
  var cards = $$(".hcard");
  var ROT = { "hcard--a": -7, "hcard--b": 6, "hcard--c": 4 };
  cards.forEach(function (c) {
    c.addEventListener("animationend", function () {
      c.style.animation = "none";
      c.style.willChange = "transform";
      c.dataset.ready = "1";
      applyParallax(0, 0);
    });
  });
  var mx = 0, my = 0;
  function applyParallax(x, y) {
    cards.forEach(function (c) {
      if (c.dataset.ready !== "1") return;
      var d = parseFloat(c.getAttribute("data-depth")) || 10;
      var rot = 0;
      for (var k in ROT) if (c.classList.contains(k)) rot = ROT[k];
      c.style.transform = "translate3d(" + (x * d).toFixed(1) + "px," +
        (y * d + window.scrollY * 0.06).toFixed(1) + "px,0) " +
        "rotate(" + (rot + x * 2).toFixed(2) + "deg)";
    });
  }
  if (canHover && !calm) {
    window.addEventListener("mousemove", function (e) {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
      applyParallax(mx, my);
    }, { passive: true });
  }

  /* ══════════ სქროლის ზოლი ══════════ */
  var bar = $("#progress"), ticking = false;
  window.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + "%";
      if (window.scrollY < window.innerHeight) applyParallax(mx, my);
      ticking = false;
    });
  }, { passive: true });

  /* ══════════ სიყვარულის საზომი ══════════ */
  var range = $("#meterRange"), mval = $("#meterVal"), mmsg = $("#meterMsg");
  var LOW = [
    "ეს ღილაკი მარცხნივ არ მოძრაობს. გატეხილია. ბოდიში.",
    "არა-არა-არა. სხვა მიმართულებით სცადე.",
    "ტექნიკური შეფერხება: სიმართლე მხოლოდ მაქსიმუმზეა."
  ];
  var MID = [
    "თბილია... მაგრამ ჯერ არა სიმართლე.",
    "კიდე ცოტა. კიდე. ჰო, მაგრად.",
    "ნახევარი? ეს შეურაცხყოფაა. "
  ];
  function pick(a) { return a[(Math.random() * a.length) | 0]; }
  function paint(v) {
    range.style.setProperty("--fill", v + "%");
    mval.textContent = v >= 100 ? "∞" : v + "%";
  }
  if (range) {
    paint(100);
    range.addEventListener("input", function () {
      var v = +range.value;
      paint(v);
      if (v >= 100) { mmsg.textContent = "აი, ეს არის სიმართლე "; return; }
      mmsg.textContent = v < 55 ? pick(LOW) : pick(MID);
    });
    var snap = function () {
      var v = +range.value;
      if (v >= 100) return;
      var id = setInterval(function () {
        v = Math.min(100, v + Math.max(1, (100 - v) * 0.12));
        range.value = v; paint(Math.round(v));
        if (v >= 99.5) {
          clearInterval(id); range.value = 100; paint(100);
          mmsg.textContent = "აი, ეს არის სიმართლე ";
          burstFrom(mval, 10);
        }
      }, 26);
    };
    range.addEventListener("change", function () { setTimeout(snap, 650); });
    range.addEventListener("pointerup", function () { setTimeout(snap, 650); });
  }

  /* ══════════ კითხვები ══════════ */
  var NO_LABELS = ["არა", "ნამდვილად?", "დაფიქრდი ", "სერიოზულად?",
    "ეს ღილაკი გატეხილია", "კარგი, კი "];
  var no1 = $("#no1"), yes1 = $("#yes1"), hint1 = $("#hint1"), tries = 0;

  function dodge() {
    if (tries >= NO_LABELS.length - 1) return;
    tries++;
    no1.textContent = NO_LABELS[tries];
    no1.classList.add("btn--runaway");
    var lim = Math.min(120, window.innerWidth / 5);
    no1.style.transform = "translate(" + rnd(-lim, lim).toFixed(0) + "px," +
      rnd(-54, 54).toFixed(0) + "px) rotate(" + rnd(-12, 12).toFixed(0) + "deg)";
    no1.style.opacity = Math.max(0.45, 1 - tries * 0.1);
    if (tries === NO_LABELS.length - 1) {
      no1.style.transform = "none"; no1.style.opacity = "1";
      hint1.textContent = "(ხო. ასეც ვიცოდი.)";
    }
  }
  if (no1) {
    if (canHover) no1.addEventListener("mouseenter", dodge);
    no1.addEventListener("click", function (e) {
      if (tries < NO_LABELS.length - 1) { e.preventDefault(); dodge(); }
      else step2();
    });
  }

  function show(id) {
    $$(".ask__step").forEach(function (s) { s.classList.add("ask__step--hidden"); });
    $(id).classList.remove("ask__step--hidden");
  }
  function step2() { show("#q2"); burstFrom($("#q2"), 16); }
  if (yes1) yes1.addEventListener("click", function () { burstFrom(this, 14); step2(); });

  var ANS = {
    a: { t: "საქმე დახურულია",
      x: "ეგრე ვიფიქრე. ბრალდებული სრულად აღიარებს და მოწმეც თვითონვეა." },
    b: { t: "ეჭვი გამართლდა",
      x: "სწორად ეჭვობდი. მთელი ეს გვერდი ნივთმტკიცებაა და სულ ერთ სახელს ამბობს." },
    c: { t: "ზუსტად",
      x: "სწორედ მას ვეძებდი. და, გულახდილად, დიდი ხანია ვიპოვე." }
  };
  $$("[data-ans]").forEach(function (b) {
    b.addEventListener("click", function () {
      var a = ANS[b.getAttribute("data-ans")];
      $("#ansTitle").textContent = a.t;
      $("#ansText").textContent = a.x;
      show("#q3");
      burstFrom($("#q3"), 20);
      heartRain(16);
    });
  });
  var again = $("#again");
  if (again) again.addEventListener("click", function () {
    tries = 0;
    no1.textContent = NO_LABELS[0];
    no1.style.transform = "none"; no1.style.opacity = "1";
    hint1.textContent = "(ერთ ღილაკს პრობლემები აქვს)";
    show("#q1");
  });

  /* ══════════ ლაითბოქსი ══════════ */
  var lb = $("#lightbox"), lbImg = $("#lightboxImg");
  $$("[data-zoom] img").forEach(function (im) {
    im.addEventListener("click", function () {
      lbImg.src = im.getAttribute("src");
      lbImg.alt = im.getAttribute("alt") || "";
      lb.classList.add("is-open");
      document.body.classList.add("no-scroll");
    });
  });
  function closeLb() {
    lb.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
  }
  lb.addEventListener("click", function (e) { if (e.target !== lbImg) closeLb(); });
  $("#lightboxX").addEventListener("click", closeLb);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeLb();
  });

  /* ══════════ თემა ══════════ */
  var themeBtn = $("#themeBtn"), themeIco = $("#themeIco");
  function setTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    themeIco.textContent = t === "night" ? "☀" : "☾";
    try { localStorage.setItem("keta-theme", t); } catch (err) {}
  }
  try {
    var saved = localStorage.getItem("keta-theme");
    if (saved) setTheme(saved);
  } catch (err) {}
  themeBtn.addEventListener("click", function () {
    var now = document.documentElement.getAttribute("data-theme");
    setTheme(now === "night" ? "day" : "night");
    burstFrom(this, 7);
  });

  /* ══════════ კონვერტი ══════════ */
  var env = $("#env"), envwrap = $("#envwrap");
  var paper = $("#letterPaper"), letterBtn = $("#letterBtn");
  var letterClose = $("#letterClose");
  var letterOpen = false, letterBusy = false;

  function openLetter() {
    if (letterOpen || letterBusy || !env) return;
    letterOpen = true; letterBusy = true;
    env.classList.add("is-open");
    burstFrom(env, 18);
    var wait = calm ? 0 : 660;
    setTimeout(function () {
      envwrap.classList.add("is-gone");
      paper.hidden = false;
      paper.classList.remove("is-back");
      paper.classList.add("is-out");
    }, wait);
    setTimeout(function () {
      envwrap.style.display = "none";
      letterBusy = false;
    }, wait + 760);
  }

  function closeLetter() {
    if (!letterOpen || letterBusy) return;
    letterOpen = false; letterBusy = true;
    paper.classList.remove("is-out");
    paper.classList.add("is-back");
    var wait = calm ? 0 : 560;
    setTimeout(function () {
      paper.hidden = true;
      paper.classList.remove("is-back");
      envwrap.style.display = "";
      void envwrap.offsetWidth;                /* reflow, რომ გადასვლა დაიჭიროს */
      envwrap.classList.remove("is-gone");
      setTimeout(function () {
        env.classList.remove("is-open");       /* ფარვალი ისევ იხურება */
        letterBusy = false;
      }, calm ? 0 : 300);
    }, wait);
  }

  if (letterBtn) letterBtn.addEventListener("click", openLetter);
  if (env) env.addEventListener("click", openLetter);
  if (letterClose) letterClose.addEventListener("click", closeLetter);

  /* ══════════ ფინალი ══════════ */
  var endHeart = $("#endHeart"), endMsg = $("#endMsg"), taps = 0;
  var TAPS = [
    "ჰო, მუშაობს.",
    "კიდე დააჭირე. სერიოზულად.",
    "ახლა უკვე უხერხულია — მაგრამ განაგრძე.",
    "კარგი, ბოლო ერთი.",
    "მიყვარხარ. ეს იყო საიდუმლო ღილაკი."
  ];
  var EXTRA = [
    "ღილაკი დაიღალა. მე არა.",
    "თითი მოგეღლება, ეს სია კი არა.",
    "კიდე? კარგი, კიდე.",
    "ეს უსასრულო მარყუჟია, ისევე როგორც ეს ყველაფერი."
  ];
  endHeart.addEventListener("click", function (e) {
    taps++;
    burst(e.clientX, e.clientY, taps < 5 ? 14 : 26);
    endHeart.style.animation = "none";
    void endHeart.offsetWidth;
    endHeart.style.animation = "beat 1.6s ease-in-out infinite";

    endMsg.textContent = taps <= TAPS.length
      ? TAPS[taps - 1]
      : EXTRA[(Math.random() * EXTRA.length) | 0];
    endMsg.classList.remove("is-pop");
    void endMsg.offsetWidth;
    endMsg.classList.add("is-pop");

    if (taps === 5) heartRain(70);
  });
  $("#toTop").addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: calm ? "auto" : "smooth" });
    heartRain(14);
  });

  /* პატარა საიდუმლო: დაწერე „keta“ */
  var buf = "";
  document.addEventListener("keydown", function (e) {
    if (e.key.length !== 1) return;
    buf = (buf + e.key.toLowerCase()).slice(-6);
    if (buf.indexOf("keta") > -1 || buf.indexOf("ქეთა") > -1) {
      heartRain(70); buf = "";
    }
  });
})();
