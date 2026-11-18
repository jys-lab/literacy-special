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
    document.querySelectorAll('.tab').forEach(function (t) {
      t.setAttribute('aria-selected', String(Number(t.dataset.step) === step));
    });
  }
  document.querySelectorAll('.tab').forEach(function (t) {
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
  var go = $('sheet-go');
  if (demo && !d.a) {
    go.href = '#';
    go.addEventListener('click', function (ev) { ev.preventDefault(); sheet.hidden = true; toast('실제 링크에서는 학원의 상담 신청 화면으로 이동합니다.'); });
  } else {
    go.href = d.a;
    go.addEventListener('click', function () { sheet.hidden = true; });
  }
  $('sheet-close').addEventListener('click', function () { sheet.hidden = true; });
  sheet.addEventListener('click', function (ev) { if (ev.target === sheet) sheet.hidden = true; });
  document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape') sheet.hidden = true; });
  function applyBtn(cls) {
    var a = el('a', '상담 신청하기', 'btn ' + cls);
    a.href = '#';
    a.addEventListener('click', function (ev) { ev.preventDefault(); sheet.hidden = false; go.focus(); });
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
