/* ==========================================================
   2036, No One Knocked — 체험형 프리모템 드라마
   experience.js
   ========================================================== */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var body = document.body;

  /* ---------- 1. 디오라마 카메라 ----------
     이미지(1659×948) 안의 목표 지점(tx, ty: %)과 배율(s).
     transform: translate(-50%,-50%) scale(s) translate((50-tx)%, (50-ty)%)
     → 목표 지점이 화면 중앙으로 온다. */
  var camera = document.querySelector("[data-camera]");
  var isNarrow = window.matchMedia("(max-width: 720px)").matches;
  var zoomFactor = isNarrow ? 0.8 : 1;

  var SHOTS = {
    ch0: { tx: 50, ty: 50, s: 1.02 },              // 서막: 암전 속 원경
    ch1: { tx: 50, ty: 48, s: 1.07 },              // 도시 전경
    ch2: { tx: 40, ty: 41, s: 3.1 },               // 4층 관제 모듈(청록 스크린 방)
    ch3: { tx: 46, ty: 74, s: 3.3 },               // 305호(따뜻한 빈 거실)
    ch4: { tx: 64, ty: 58, s: 2.5 },               // 끊어진 접촉선
    ch5: { tx: 52, ty: 52, s: 1.35 },              // 문서 장: 어두운 원경
    ch6: { tx: 48, ty: 55, s: 1.35 },
    ch7: { tx: 50, ty: 58, s: 1.6 },               // 접촉선 층이 보이는 중경
    ch8: { tx: 52, ty: 50, s: 1.3 },
    ch9: { tx: 50, ty: 50, s: 1.0 }                // 종막: 전체
  };

  function applyShot(id) {
    var shot = SHOTS[id];
    if (!shot || !camera) return;
    var s = 1 + (shot.s - 1) * zoomFactor;
    var dx = (50 - shot.tx);
    var dy = (50 - shot.ty);
    camera.style.transform =
      "translate(-50%, -50%) scale(" + s + ") translate(" + dx + "%, " + dy + "%)";
  }

  /* ---------- 2. 장면 전환 감시 ---------- */
  var scenes = Array.prototype.slice.call(document.querySelectorAll("[data-scene]"));
  var railLinks = {};
  Array.prototype.forEach.call(document.querySelectorAll("[data-rail]"), function (a) {
    railLinks[a.dataset.rail] = a;
  });

  var sceneEffects = {
    ch1: function () { body.classList.add("hud-on"); },
    ch2: function () { startTicks(); },
    ch3: function () {
      runDaysCounter();
      showContactLine("측정 안 함", "");
    },
    ch4: function () { showContactLine("0회 / 412일", "warn"); },
    ch7: function () { showContactLine("기준 미달 · 미설계", "warn"); },
    ch9: function () {
      if (!body.classList.contains("is-healed")) {
        showContactLine("기준 미달 · 미설계", "warn");
      }
    }
  };

  var activeId = null;
  function activateScene(id) {
    if (id === activeId) return;
    activeId = id;
    body.setAttribute("data-active", id);
    applyShot(id);
    Object.keys(railLinks).forEach(function (key) {
      railLinks[key].classList.toggle("is-active", key === id);
    });
    if (sceneEffects[id]) sceneEffects[id]();
  }

  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          activateScene(entry.target.dataset.scene);
        }
      });
    },
    { threshold: 0.42 }
  );
  scenes.forEach(function (scene) { io.observe(scene); });

  /* ---------- 3. HUD 상태 ---------- */
  var hudContactRow = document.querySelector("[data-hud-contact]");
  var hudContactVal = document.querySelector('[data-hud="contact"]');
  var hudStamp = document.querySelector("[data-hud-stamp]");

  function showContactLine(text, mode) {
    if (!hudContactRow) return;
    hudContactRow.hidden = false;
    hudContactVal.textContent = text;
    body.classList.toggle("hud-contact-warn", mode === "warn");
    body.classList.toggle("hud-contact-ok", mode === "ok");
    if (hudStamp) {
      hudStamp.textContent =
        mode === "warn" ? "측정되지 않은 단절 · UNMEASURED" :
        mode === "ok" ? "접촉선 회복 · CONTACT RESTORED" :
        "이상 없음 · NO ANOMALY";
    }
  }

  /* ---------- 4. 서막 타자기 ---------- */
  var bootEl = document.querySelector("[data-boot]");
  var BOOT_LINES = [
    "SEOUL METROPOLITAN CARE GRID v9.4",
    "정기 야간 감사 · 2036-03-14 04:12:07 KST",
    "----------------------------------------",
    "감시 가구 ............ 1,248 / 1,248",
    "생체 지표 ............ 전 가구 정상",
    "복약 순응도 .......... 99.2%",
    "평균 위험 점수 ....... 0.12 (▼ 전월 대비)",
    "예산 집행 효율 ....... +18.4%",
    "----------------------------------------",
    "판정: 이상 없음 · 조치 필요 가구 0"
  ];

  function typeBoot() {
    if (!bootEl) return;
    if (reduceMotion) {
      bootEl.textContent = BOOT_LINES.join("\n");
      body.classList.add("prologue-done");
      return;
    }
    var li = 0, ci = 0, out = "";
    var skipped = false;
    function skip() {
      if (skipped) return;
      skipped = true;
      bootEl.textContent = BOOT_LINES.join("\n");
      body.classList.add("prologue-done");
    }
    // 사용자가 먼저 스크롤하면 타자 연출을 건너뛴다
    window.addEventListener("scroll", function onScroll() {
      if (window.scrollY > 40) { skip(); window.removeEventListener("scroll", onScroll); }
    }, { passive: true });

    (function step() {
      if (skipped) return;
      if (li >= BOOT_LINES.length) {
        body.classList.add("prologue-done");
        return;
      }
      var line = BOOT_LINES[li];
      if (ci <= line.length) {
        bootEl.textContent = out + line.slice(0, ci);
        ci += 2;
        setTimeout(step, 14);
      } else {
        out += line + "\n";
        li += 1; ci = 0;
        setTimeout(step, li === 3 || li === 9 ? 220 : 120);
      }
    })();
  }
  typeBoot();

  /* ---------- 5. 제2장 실시간 지표 ---------- */
  var tickStarted = false;
  function startTicks() {
    if (tickStarted || reduceMotion) return;
    tickStarted = true;
    var hr = document.querySelector('[data-tick="hr"]');
    var steps = document.querySelector('[data-tick="steps"]');
    var stepCount = 1847;
    setInterval(function () {
      if (hr) hr.textContent = String(60 + Math.floor(Math.random() * 5));
      if (steps && Math.random() < 0.4) {
        stepCount += Math.floor(Math.random() * 3);
        steps.textContent = stepCount.toLocaleString("ko-KR");
      }
    }, 1600);
  }

  /* ---------- 6. 제3장 412일 카운터 ---------- */
  var daysEl = document.querySelector("[data-days]");
  var daysDone = false;
  function runDaysCounter() {
    if (!daysEl || daysDone) return;
    daysDone = true;
    if (reduceMotion) { daysEl.textContent = "412"; return; }
    var start = null;
    var DURATION = 2200;
    function frame(t) {
      if (!start) start = t;
      var p = Math.min(1, (t - start) / DURATION);
      var eased = 1 - Math.pow(1 - p, 3);
      daysEl.textContent = String(Math.round(412 * eased));
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ---------- 7. CARE+ 원칙 ---------- */
  var CARE = [
    {
      title: "Contact Floor",
      body: "위험 점수와 무관하게 최소 대면 접촉선을 둔다. 월 1회 이상 대면 확인 또는 지역 관계망 확인을 공공 AI 돌봄의 기본 조건으로 만든다. 점수가 아무리 낮아도, 이 선 아래로는 내려가지 않는다.",
      impl: "실행 주체: 보건복지부·지자체 — 공공 돌봄 위탁 계약의 표준 조항으로 5년 내 의무화",
      hud: "최저선 설정 · 月 1회"
    },
    {
      title: "Accountability Log",
      body: "모델 권고, 기관 배정, 현장 조치, 방문 생략 사유를 하나의 책임 로그로 남긴다. 「AI가 권고했다」는 말이 책임의 끝이 되지 않게 한다.",
      impl: "실행 주체: 운영 기관 — 권고·결정·생략 사유의 단일 기록 의무, 감사 시 공개",
      hud: "책임 로그 · 기록 중"
    },
    {
      title: "Relationship Metric",
      body: "복약 성공률만 보지 않는다. 도움을 청할 수 있는 사람 수, 최근 대면 접촉, 정기 연락망, 지역 참여도를 핵심 성과 지표로 둔다. 측정되는 것만이 지켜진다.",
      impl: "실행 주체: 평가·예산 부처 — 돌봄 사업 성과 평가표에 관계 지표 반영",
      hud: "관계 지표 · 신설"
    },
    {
      title: "Exit & Escalation",
      body: "당사자는 AI 돌봄 방식과 데이터 수집 범위를 거부하거나 대면 지원으로 전환할 수 있어야 한다. 「사람이 와줬으면 한다」는 요청이 시스템 안에 버튼으로 존재해야 한다.",
      impl: "실행 주체: 서비스 설계 — 전환 요청 절차를 기본 UI에 포함, 처리 기한 명시",
      hud: "전환 요청 · 접수 가능"
    },
    {
      title: "Institutional Oversight",
      body: "인간 감독은 담당자 한 명의 최종 클릭이 아니다. 기관이 AI 도입의 적절성, 지표 설계, 현장 영향, 이의제기 절차를 공개적으로 설명하고 검증받는 구조여야 한다.",
      impl: "실행 주체: 의회·감사기구·시민사회 — 연 1회 공개 검증 및 이의제기 창구 운영",
      hud: "기관 감독 · 공개 검증"
    }
  ];

  var careButtons = Array.prototype.slice.call(document.querySelectorAll("[data-care]"));
  var careTitle = document.querySelector("[data-care-title]");
  var careBody = document.querySelector("[data-care-body]");
  var careImpl = document.querySelector("[data-care-impl]");

  careButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var idx = Number(btn.dataset.care) || 0;
      var item = CARE[idx];
      careButtons.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-selected", String(on));
      });
      if (careTitle) careTitle.textContent = item.title;
      if (careBody) careBody.textContent = item.body;
      if (careImpl) careImpl.textContent = item.impl;
      showContactLine(item.hud, "ok");
      body.classList.remove("hud-contact-ok");
      // CARE+ 장에서는 '설계 중' 상태로 민트 점등
      if (hudContactVal) hudContactVal.style.color = "";
      body.classList.add("hud-contact-ok");
      if (hudStamp) hudStamp.textContent = "CARE+ 패치 설계 중 · DRAFTING";
    });
  });

  /* ---------- 8. 종막: 노크 ---------- */
  var knockBtn = document.querySelector("[data-knock]");
  var knockResult = document.querySelector("[data-knock-result]");

  function playKnockSound() {
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      var ctx = playKnockSound._ctx || (playKnockSound._ctx = new AC());
      [0, 0.18].forEach(function (delay) {
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(95, ctx.currentTime + delay);
        osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + delay + 0.09);
        gain.gain.setValueAtTime(0.0001, ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.32, ctx.currentTime + delay + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + 0.16);
        osc.connect(gain).connect(ctx.destination);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 0.2);
      });
    } catch (e) { /* 소리는 선택 사항 */ }
  }

  if (knockBtn) {
    knockBtn.addEventListener("click", function () {
      playKnockSound();
      body.classList.remove("is-knocking");
      // 리플 재시작
      void body.offsetWidth;
      body.classList.add("is-knocking");
      body.classList.add("is-healed");
      if (knockResult) knockResult.hidden = false;
      showContactLine("1회 · 기준선 회복", "ok");
      knockBtn.querySelector("strong").textContent = "다시 두드리기";
    });
  }

  /* ---------- 9. 빗줄기 ---------- */
  var rainCanvas = document.querySelector("[data-rain]");
  if (rainCanvas && !reduceMotion) {
    var ctx2 = rainCanvas.getContext("2d");
    var drops = [];
    var W = 0, H = 0;

    function resize() {
      W = rainCanvas.width = window.innerWidth;
      H = rainCanvas.height = window.innerHeight;
      var count = Math.min(150, Math.floor(W / 9));
      drops = [];
      for (var i = 0; i < count; i++) {
        drops.push({
          x: Math.random() * W,
          y: Math.random() * H,
          len: 9 + Math.random() * 16,
          v: 7 + Math.random() * 8,
          a: 0.06 + Math.random() * 0.16
        });
      }
    }
    resize();
    window.addEventListener("resize", resize);

    var running = true;
    document.addEventListener("visibilitychange", function () {
      running = !document.hidden;
      if (running) requestAnimationFrame(draw);
    });

    function draw() {
      if (!running) return;
      ctx2.clearRect(0, 0, W, H);
      ctx2.lineWidth = 1;
      for (var i = 0; i < drops.length; i++) {
        var d = drops[i];
        ctx2.strokeStyle = "rgba(170, 225, 235," + d.a + ")";
        ctx2.beginPath();
        ctx2.moveTo(d.x, d.y);
        ctx2.lineTo(d.x - 1.4, d.y + d.len);
        ctx2.stroke();
        d.y += d.v;
        d.x -= 0.5;
        if (d.y > H) { d.y = -d.len; d.x = Math.random() * W; }
      }
      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  }
})();

/* ==========================================================
   v2 — 번개 · HUD 시계 · 글리치 · 데이터 카운트업
   ========================================================== */
(function () {
  "use strict";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var body = document.body;

  /* ---------- 번개: 불규칙한 간격으로 번쩍 ---------- */
  var lightning = document.querySelector("[data-lightning]");
  if (lightning && !reduceMotion) {
    (function strike() {
      var wait = 9000 + Math.random() * 17000;
      setTimeout(function () {
        // 암전 장(서막·문서 장)에서는 약하게만
        lightning.classList.remove("flash");
        void lightning.offsetWidth;
        lightning.classList.add("flash");
        strike();
      }, wait);
    })();
  }

  /* ---------- HUD 시계: 2036-03-14 04:12:07부터 흐른다 ---------- */
  var clockEl = document.querySelector("[data-hud-clock]");
  if (clockEl) {
    // 표시 시각을 보는 사람의 시간대와 무관하게 KST로 고정
    var t0 = Date.UTC(2036, 2, 14, 4, 12, 7);
    var start = Date.now();
    function pad(n) { return String(n).padStart(2, "0"); }
    setInterval(function () {
      var d = new Date(t0 + (Date.now() - start));
      clockEl.textContent =
        d.getUTCFullYear() + "-" + pad(d.getUTCMonth() + 1) + "-" + pad(d.getUTCDate()) +
        " " + pad(d.getUTCHours()) + ":" + pad(d.getUTCMinutes()) + ":" + pad(d.getUTCSeconds()) + " KST";
    }, 1000);
  }

  /* ---------- 글리치: 1장 진입 시 + 이후 간헐 ---------- */
  function glitchOnce() {
    if (reduceMotion) return;
    body.classList.remove("glitching");
    void body.offsetWidth;
    body.classList.add("glitching");
    setTimeout(function () { body.classList.remove("glitching"); }, 720);
  }
  var glitchObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        glitchOnce();
        setInterval(function () { if (Math.random() < 0.45) glitchOnce(); }, 7000);
        glitchObserver.disconnect();
      }
    });
  }, { threshold: 0.5 });
  var glitchTarget = document.querySelector(".glitch");
  if (glitchTarget) glitchObserver.observe(glitchTarget);

  /* ---------- 데이터 월: 화면 진입 시 카운트업 ---------- */
  var stats = Array.prototype.slice.call(document.querySelectorAll("[data-stat]"));
  if (stats.length) {
    var statIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        statIO.unobserve(el);
        var target = parseFloat(el.dataset.stat);
        var decimals = Number(el.dataset.decimal || 0);
        if (reduceMotion) {
          el.textContent = target.toLocaleString("ko-KR", {
            minimumFractionDigits: decimals, maximumFractionDigits: decimals
          });
          return;
        }
        var begin = null;
        var DUR = 1800 + Math.random() * 600;
        function frame(t) {
          if (!begin) begin = t;
          var p = Math.min(1, (t - begin) / DUR);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = (target * eased).toLocaleString("ko-KR", {
            minimumFractionDigits: decimals, maximumFractionDigits: decimals
          });
          if (p < 1) requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
      });
    }, { threshold: 0.5 });
    stats.forEach(function (el) { statIO.observe(el); });
  }
})();
