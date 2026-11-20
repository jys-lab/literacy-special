/* 일취월장 문해력 특강 · 학부모 페이지 동작 */
(function () {
  'use strict';
  var K = window.ILJWI;
  var $ = function (id) { return document.getElementById(id); };

  /* ---------- 독후감 예시 (가상) ---------- */
  var BOOK = '『마당을 나온 암탉』';
  /* 고정 문구만 넣음(학원 입력값 아님) */
  var ESSAYS = [
    {
      title: '① 스스로 쓴 글',
      body: [
        '나는 ' + BOOK + '을 읽었다. 잎싹이라는 암탉이 마당을 나와서 여러 가지 일을 겪는 이야기다. 잎싹은 알을 품고 아기를 키웠다. 그런데 족제비 때문에 힘들었다.',
        '마지막에 너무 슬펐다. 잎싹이 불쌍했다. 이 책은 정말 감동적이었다. 다음에 또 읽고 싶다.'
      ],
      problems: ['줄거리가 "여러 가지 일"로 뭉뚱그려짐', '"슬펐다", "감동적이었다"의 까닭이 없음'],
      what: '많은 아이들이 처음 쓰는 독후감의 모습입니다. 무슨 일이 있었는지, 왜 그렇게 느꼈는지가 빠져 있습니다.'
    },
    {
      title: '② 선생님 피드백',
      feedbackHtml: [
        '잎싹이 마당을 나와 여러 일을 겪는다는 큰 흐름을 잘 잡았어요. 두 가지를 더하면 훨씬 좋은 글이 될 거예요.',
        '<b>하나, 줄거리를 차례대로 써 보세요.</b> "여러 가지 일"이 무엇이었는지, 잎싹이 왜 마당을 나왔고 누구를 키웠는지 드러나게요.<span class="ex">예) 잎싹은 알을 품어 보고 싶어서 양계장을 나왔다. 그러다 주인 없는 오리알을 품어 초록머리를 키웠다.</span>',
        '<b>둘, 느낌에는 장면과 까닭을 붙여 보세요.</b> "너무 슬펐다"고 했는데, 어느 장면에서 그랬나요?<span class="ex">예) ○○ 장면에서 슬펐다. 왜냐하면 ○○ 때문이다.</span>'
      ],
      what: '고칠 점만 짚지 않고, 이렇게 써 보라는 예시 문장까지 들어 지도합니다.'
    },
    {
      title: '③ 피드백을 반영해 다시 쓴 글',
      body: [
        '나는 ' + BOOK + '을 읽었다. <mark>양계장에 갇혀 알만 낳던 암탉 잎싹은 알을 품어 병아리를 보고 싶다는 꿈을 안고 마당을 나왔다. 그러다 주인 없는 오리알을 발견해 정성껏 품었고, 알에서 나온 아기 청둥오리 초록머리를 키웠다. 잎싹은 족제비에게 쫓기면서도 초록머리를 끝까지 지켰다.</mark>',
        '<mark>가장 슬펐던 장면은 다 자란 초록머리가 청둥오리 떼를 따라 떠나는 장면이다. 잎싹이 온 힘을 다해 키운 아이와 헤어져야 했기 때문이다.</mark> <mark>그런데 잎싹은 초록머리를 붙잡지 않았다. 나는 그 모습을 보고 잎싹이 초록머리가 자기 길을 가기를 바랐다는 것을 알게 되었다.</mark> 이 책은 정말 감동적이었다. <mark>자기 꿈을 위해 마당을 나온 잎싹처럼, 나도 하고 싶은 일이 생기면 용기를 내 보고 싶다.</mark>'
      ],
      what: '피드백대로 줄거리를 차례대로 채우고, 슬펐던 장면과 그 까닭, 새로 든 생각을 더했습니다. 이 글에 최종 피드백을 받으면 독서로에 저장합니다.'
    }
  ];

  function renderEssay(step) {
    var e = ESSAYS[step];
    var html = '<span class="badge">예시</span><h3>' + e.title + '</h3>';
    if (e.feedbackHtml) {
      html += '<div class="feedback fb-body"><b>선생님 피드백</b>';
      e.feedbackHtml.forEach(function (p) { html += '<p>' + p + '</p>'; });
      html += '</div>';
    }
    (e.body || []).forEach(function (p) { html += '<p>' + p + '</p>'; });
    if (e.problems) html += '<div class="problems">' + e.problems.map(function (x) { return '<span>' + x + '</span>'; }).join('') + '</div>';
    html += '<p class="what">' + e.what + '</p>';
    $('essay').innerHTML = html; /* 고정 문구만 넣음(학원 입력값 아님) */
    document.querySelectorAll('.tab[data-step]').forEach(function (t) {
      t.setAttribute('aria-selected', String(Number(t.dataset.step) === step));
    });
  }
  document.querySelectorAll('.tab[data-step]').forEach(function (t) {
    t.addEventListener('click', function () { renderEssay(Number(t.dataset.step)); });
  });
  renderEssay(0);

  /* ---------- 학습 화면 넘기기 (화살표·손가락) ---------- */
  var car = $('carousel');
  var slides = car.querySelectorAll('figure');
  var dots = $('dots').children;
  var prevBtn = document.querySelector('.nav.prev');
  var nextBtn = document.querySelector('.nav.next');
  function current() {
    var mid = car.scrollLeft + car.clientWidth / 2, best = 0, gap = Infinity;
    slides.forEach(function (s, i) {
      var c = s.offsetLeft + s.offsetWidth / 2;
      if (Math.abs(c - mid) < gap) { gap = Math.abs(c - mid); best = i; }
    });
    return best;
  }
  function go(i) {
    i = Math.max(0, Math.min(slides.length - 1, i));
    var s = slides[i];
    var target = Math.max(0, Math.min(car.scrollWidth - car.clientWidth, s.offsetLeft - (car.clientWidth - s.offsetWidth) / 2));
    var before = car.scrollLeft;
    car.scrollTo({ left: target, behavior: 'smooth' });
    /* 부드러운 이동이 실행되지 않는 환경이면 바로 이동 */
    setTimeout(function () {
      if (Math.abs(car.scrollLeft - before) < 2 && Math.abs(target - before) >= 2) car.scrollLeft = target;
      sync();
    }, 450);
  }
  function sync() {
    var i = current();
    Array.prototype.forEach.call(dots, function (d, k) { d.classList.toggle('on', k === i); });
    prevBtn.disabled = i === 0;
    nextBtn.disabled = i === slides.length - 1;
  }
  prevBtn.addEventListener('click', function () { go(current() - 1); });
  nextBtn.addEventListener('click', function () { go(current() + 1); });
  car.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync);
  sync();

  /* ---------- 탭 자동 전환 (4초) + 이전/다음 버튼 ----------
     화면에 보일 때만 넘어가고, 직접 누르면 그 탭부터 다시 4초를 셈 */
  function autoTabs(tabs, area, label, pinEls) {
    tabs = Array.prototype.slice.call(tabs);
    if (tabs.length < 2 || !area) return;
    var AUTO = 4000, timer = null, visible = false, pinned = false;
    /* 내용 아래: 렌즈 모양 시간 바 + 이전/다음 버튼 줄 */
    var tbar = document.createElement('div');
    tbar.className = 'tbar';
    tbar.setAttribute('aria-hidden', 'true');
    tbar.innerHTML = '<i></i>';
    var bar = document.createElement('div');
    bar.className = 'stepper';
    bar.innerHTML = '<button type="button" class="sp-prev" aria-label="' + label + ' 이전">‹ 이전</button>' +
      '<span class="mid"><span class="count"><b class="sp-now">1</b> / ' + tabs.length + '</span>' +
      '<button type="button" class="sp-play" aria-label="' + label + ' 자동 넘김">멈추기</button></span>' +
      '<button type="button" class="sp-next" aria-label="' + label + ' 다음">다음 ›</button>';
    area.parentNode.insertBefore(bar, area.nextSibling);
    area.parentNode.insertBefore(tbar, bar);
    var play = bar.querySelector('.sp-play');
    function cur() {
      for (var i = 0; i < tabs.length; i++) if (tabs[i].getAttribute('aria-selected') === 'true') return i;
      return 0;
    }
    function schedule() {
      clearTimeout(timer);
      tbar.classList.remove('run');
      bar.querySelector('.sp-now').textContent = cur() + 1;
      play.textContent = pinned ? '▶ 고정됨 · 자동 넘김 켜기' : '❚❚ 멈추기';
      play.classList.toggle('pinned', pinned);
      if (!visible || pinned) return;
      void tbar.offsetWidth; /* 시간 바를 처음부터 다시 */
      tbar.style.setProperty('--auto', AUTO + 'ms');
      tbar.classList.add('run');
      timer = setTimeout(function () { tabs[(cur() + 1) % tabs.length].click(); }, AUTO);
    }
    function pin(on) { pinned = on; schedule(); }
    tabs.forEach(function (t) { t.addEventListener('click', function () { setTimeout(schedule, 0); }); });
    bar.querySelector('.sp-prev').addEventListener('click', function () { tabs[(cur() - 1 + tabs.length) % tabs.length].click(); });
    bar.querySelector('.sp-next').addEventListener('click', function () { tabs[(cur() + 1) % tabs.length].click(); });
    play.addEventListener('click', function () { pin(!pinned); });
    /* 내용을 누르면 그 화면에 고정 */
    (pinEls || [area]).forEach(function (el) {
      el.classList.add('pin-area');
      el.addEventListener('click', function () { if (!pinned) pin(true); });
    });
    /* 탭 줄이나 이전/다음 줄 중 하나라도 화면에 보이면 '보는 중'으로 봄 */
    if ('IntersectionObserver' in window) {
      var seen = new Set();
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) seen.add(en.target); else seen.delete(en.target); });
        var now = seen.size > 0;
        if (now !== visible) { visible = now; schedule(); }
      }, { threshold: 0.6 });
      io.observe(tabs[0].parentNode);
      io.observe(bar);
    } else { visible = true; schedule(); }
  }
  autoTabs(document.querySelectorAll('.tab[data-step]'), $('essay'), '독후감 예시');
  autoTabs(document.querySelectorAll('.real-tabs .tab'), document.querySelector('figure.real[data-real="2"]'), '실제 학생 글',
    Array.prototype.slice.call(document.querySelectorAll('figure.real')));

  /* ---------- 학생 후기 더 보기 ---------- */
  var moreBtn = $('more-reviews');
  if (moreBtn) moreBtn.addEventListener('click', function () {
    var list = $('reviews');
    var open = list.classList.toggle('open');
    moreBtn.textContent = open ? '후기 접기' : '후기 더 보기';
  });

  /* ---------- 일부 타이틀 등장 효과 ----------
     화면에 들어올 때 한 번 재생. 효과가 멈추는 환경에 대비해 1.6초 뒤엔 무조건 보이게 함 */
  (function () {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.querySelectorAll('.tl tbody tr').forEach(function (tr, i) {
      tr.setAttribute('data-fx', 'up');
      tr.setAttribute('data-fx-delay', String(250 + i * 120));
    });
    var items = document.querySelectorAll('[data-fx]');
    if (reduce || !items.length) return;
    function play(el) {
      var delay = Number(el.getAttribute('data-fx-delay')) || 0;
      el.style.animationDelay = delay + 'ms';
      el.classList.add('fx-in');
      /* 등장이 끝나면(효과가 멈추는 환경에서도 1.6초 뒤) 보이게 고정하고, 제목은 2초 반복 움직임으로 */
      setTimeout(function () {
        el.style.animationDelay = '0ms';
        el.classList.add('fx-done');
        if (el.getAttribute('data-fx') !== 'up') el.classList.add('fx-loop');
      }, 1600 + delay);
    }
    if (!('IntersectionObserver' in window)) return; /* 지원하지 않으면 효과 없이 그대로 보임 */
    document.documentElement.classList.add('fx-on');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var el = en.target;
        if (!el.classList.contains('fx-in')) {
          if (en.isIntersecting) play(el);
          else el.classList.add('fx-wait'); /* 화면 아래 → 보일 때까지 숨겨 둠 */
        }
        el.classList.toggle('fx-pause', !en.isIntersecting); /* 화면 밖에선 반복 멈춤 */
      });
    }, { threshold: 0.25 });
    items.forEach(function (el) { io.observe(el); });
  })();

  /* ---------- 실제 학생 글 1차/2차 바꿔 보기 ---------- */
  document.querySelectorAll('.real-tabs .tab').forEach(function (t) {
    t.addEventListener('click', function () {
      var n = t.getAttribute('data-real');
      document.querySelectorAll('.real-tabs .tab').forEach(function (x) { x.setAttribute('aria-selected', String(x === t)); });
      document.querySelectorAll('figure.real').forEach(function (f) { f.hidden = f.getAttribute('data-real') !== n; });
    });
  });

  /* ---------- 크게 보기 ---------- */
  var lb = $('lightbox');
  document.querySelectorAll('.shot').forEach(function (b) {
    b.addEventListener('click', function () {
      var img = b.querySelector('img');
      lb.querySelector('img').src = img.src;
      lb.querySelector('img').alt = img.alt;
      lb.hidden = false;
    });
  });
  lb.addEventListener('click', function () { lb.hidden = true; });
  document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape') lb.hidden = true; });

  /* ---------- 학원 정보 ---------- */
  var params = new URLSearchParams(location.search);
  var demo = params.get('demo') === '1';
  var d = demo ? K.sanitize(K.SAMPLE) : K.fromSearch(location.search);
  if (!d) return; /* 본사 기본 안내 그대로 */

  function el(tag, text, cls) {
    var x = document.createElement(tag);
    if (text) x.textContent = text;
    if (cls) x.className = cls;
    return x;
  }
  function toast(msg) {
    var t = el('div', msg, 'toast');
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 2600);
  }

  if (demo) $('demo-bar').hidden = false;
  document.title = d.n + ' | 일취월장 문해력 특강';
  $('band-name').textContent = d.n;
  $('acad-band').hidden = false;

  /* 일정 카드 */
  if (K.hasSchedule(d)) {
    $('sch-title').textContent = d.n + ' 특강 일정';
    var info = $('sch-info');
    function addInfo(label, value, small) {
      if (!value) return;
      info.appendChild(el('dt', label));
      var dd = el('dd', value);
      if (small) dd.appendChild(el('small', small));
      info.appendChild(dd);
    }
    addInfo('과정', d.w ? d.w + '주 과정' : '');
    addInfo('기간', K.periodText(d));
    /* 입력 예시에서는 권장 가격으로 오해하지 않게 금액을 가림 */
    addInfo('특강비', demo ? '○○○,○○○원 (전체 과정)' : K.feeText(d), d.f ? d.m : '');
    var rows = K.visibleRows(d);
    if (rows.length) {
      var list = $('sch-list');
      rows.forEach(function (r) {
        var li = document.createElement('li');
        var top = el('div', '', 'cl-top');
        top.appendChild(el('span', K.gradeText(r[0]), 'cl-grade'));
        if (r[4]) top.appendChild(el('span', r[4], 'cl-name'));
        if (r[1].length) top.appendChild(el('span', K.perWeekText(r[1]), 'cl-freq'));
        li.appendChild(top);
        li.appendChild(el('div', [K.dayText(r[1]), K.timeText(r[2], r[3])].filter(Boolean).join(' · '), 'cl-time'));
        list.appendChild(li);
      });
      $('sch-classes').hidden = false;
    }
    $('schedule').hidden = false;
  }

  /* 목표 요약에 운영 주차 */
  if (d.w) $('sum-weeks').textContent = ' ' + d.w + '주';

  /* 매일국어 회차 */
  var goal = K.sessionsText(d);
  if (goal) { $('mk-goal').textContent = goal; $('mk-goal').hidden = false; }

  /* 문의·신청 */
  $('ct-title').textContent = d.n + '에서 상담받아 보세요';
  $('ct-desc').textContent = '수업 일정과 특강비, 신청 방법을 안내해 드립니다.';
  var tel = K.phoneNumber(d.t);
  function callBtn(cls) {
    var a = el('a', '전화 상담', 'btn ' + cls);
    a.href = demo ? '#' : 'tel:' + tel;
    if (demo) a.addEventListener('click', function (ev) { ev.preventDefault(); toast('예시 화면이라 전화가 연결되지 않습니다.'); });
    return a;
  }
  /* 상담 신청: 바로 넘기지 않고, 이동한 페이지에서 한 번 더 신청해야 함을 먼저 안내 */
  var sheet = $('sheet');
  $('sheet-acad').textContent = d.n;
  /* 이름 주의: 'go'는 화면 넘기기 함수 이름이라 겹치면 넘기기가 멈춤 */
  var sheetGo = $('sheet-go');
  if (demo && !d.a) {
    sheetGo.href = '#';
    sheetGo.addEventListener('click', function (ev) { ev.preventDefault(); sheet.hidden = true; toast('실제 링크에서는 학원의 상담 신청 화면으로 이동합니다.'); });
  } else {
    sheetGo.href = d.a;
    sheetGo.addEventListener('click', function () { sheet.hidden = true; });
  }
  $('sheet-close').addEventListener('click', function () { sheet.hidden = true; });
  sheet.addEventListener('click', function (ev) { if (ev.target === sheet) sheet.hidden = true; });
  document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape') sheet.hidden = true; });
  function applyBtn(cls) {
    var a = el('a', '상담 신청하기', 'btn ' + cls);
    a.href = '#';
    a.addEventListener('click', function (ev) { ev.preventDefault(); sheet.hidden = false; sheetGo.focus(); });
    return a;
  }
  var canApply = !!d.a || demo;
  if (tel) {
    var telLink = $('ct-tel');
    telLink.textContent = d.t;
    telLink.href = demo ? '#' : 'tel:' + tel;
    if (demo) telLink.addEventListener('click', function (ev) { ev.preventDefault(); toast('예시 화면이라 전화가 연결되지 않습니다.'); });
    telLink.hidden = false;
  }
  if (tel || canApply) {
    var groups = [$('hero-cta'), $('ct-cta'), $('bar-inner')];
    groups.forEach(function (g, i) {
      if (canApply) g.appendChild(applyBtn('btn-primary'));
      if (tel) g.appendChild(callBtn(i === 1 ? 'btn-ghost' : 'btn-ghost'));
    });
    $('hero-cta').hidden = false;
    $('ct-cta').hidden = false;
    $('bar').hidden = false;
    document.body.classList.add('has-bar');
  }
})();
