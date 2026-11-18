/* 일취월장 문해력 특강 · 학원 전용 링크 만들기 */
(function () {
  'use strict';
  var K = window.ILJWI;
  var $ = function (id) { return document.getElementById(id); };
  var MAX_ROWS = K.MAX_CLASSES;
  var rowsBox = $('rows');
  var rowSeq = 0;

  /* ---------- 학년별 일정 줄 ---------- */
  function chip(type, name, value, text) {
    var label = document.createElement('label');
    var input = document.createElement('input');
    input.type = type; input.name = name; input.value = value;
    var span = document.createElement('span');
    span.textContent = text;
    label.appendChild(input); label.appendChild(span);
    return label;
  }

  function addRow(data) {
    if (rowsBox.children.length >= MAX_ROWS) return;
    rowSeq++;
    var row = document.createElement('div');
    row.className = 'srow';
    var top = document.createElement('div');
    top.className = 'top';
    var title = document.createElement('span');
    top.appendChild(title);
    var del = document.createElement('button');
    del.type = 'button'; del.className = 'btn-text'; del.textContent = '이 반 지우기';
    del.addEventListener('click', function () { row.remove(); renumber(); update(); });
    top.appendChild(del);
    row.appendChild(top);

    /* 고정 문구만 넣는 꼬리표 */
    function subLabel(text, cls, tag) {
      var l = document.createElement('div'); l.className = 'sub';
      l.innerHTML = text + ' <span class="tag ' + cls + '">' + tag + '</span>';
      row.appendChild(l);
    }
    function note(html) {
      var p = document.createElement('p'); p.className = 'empty-note'; p.innerHTML = html; row.appendChild(p);
    }

    subLabel('반 이름', 'opt', '선택');
    var nameIn = document.createElement('input');
    nameIn.type = 'text'; nameIn.className = 'cn'; nameIn.maxLength = 15;
    nameIn.placeholder = '예: 저(고)학년 반, 주 3일 반';
    nameIn.setAttribute('aria-label', '반 이름');
    row.appendChild(nameIn);
    note('<b>비워 두면</b> 학년과 \'주 N회\'만 표시됩니다.');

    subLabel('대상 학년', 'cond', '반 표시 시 필수');
    var grades = document.createElement('div'); grades.className = 'seg g';
    K.GRADES.forEach(function (g) { grades.appendChild(chip('checkbox', 'g' + rowSeq, g, '예비 초' + g)); });
    row.appendChild(grades);

    subLabel('요일', 'cond', '요일·시간 중 하나 필수');
    var days = document.createElement('div'); days.className = 'seg d';
    K.DAYS.forEach(function (name, i) { days.appendChild(chip('checkbox', 'd' + rowSeq, i, name)); });
    row.appendChild(days);

    subLabel('시간', 'opt', '선택');
    var times = document.createElement('div'); times.className = 'row';
    var start = document.createElement('input'); start.type = 'time'; start.className = 'ts'; start.setAttribute('aria-label', '시작 시간');
    var end = document.createElement('input'); end.type = 'time'; end.className = 'te'; end.setAttribute('aria-label', '끝나는 시간');
    times.appendChild(start); times.appendChild(end);
    row.appendChild(times);
    note('<b>시간을 비워 두면</b> 요일만 나옵니다. 끝나는 시간만 비우면 \'15:00 시작\'처럼 나옵니다.');
    var msg = document.createElement('p'); msg.className = 'msg warn'; row.appendChild(msg);

    if (data) {
      data[0].forEach(function (g) { var c = grades.querySelector('input[value="' + g + '"]'); if (c) c.checked = true; });
      data[1].forEach(function (i) { var c = days.querySelector('input[value="' + i + '"]'); if (c) c.checked = true; });
      start.value = data[2] || '';
      end.value = data[3] || '';
      nameIn.value = data[4] || '';
    }
    row.addEventListener('input', update);
    row.addEventListener('change', update);
    rowsBox.appendChild(row);
    renumber();
  }

  function renumber() {
    Array.prototype.forEach.call(rowsBox.children, function (row, i) {
      row.querySelector('.top span').textContent = (i + 1) + '번째 반';
    });
    $('add-row').hidden = rowsBox.children.length >= MAX_ROWS;
  }

  function readRows() {
    return Array.prototype.map.call(rowsBox.children, function (row) {
      var pick = function (sel) {
        return Array.prototype.filter.call(row.querySelectorAll(sel + ' input'), function (c) { return c.checked; })
          .map(function (c) { return Number(c.value); });
      };
      return [pick('.g'), pick('.d'), row.querySelector('.ts').value, row.querySelector('.te').value, row.querySelector('.cn').value];
    });
  }

  /* ---------- 입력 읽기 ---------- */
  function radio(name) { return Number(document.querySelector('input[name="' + name + '"]:checked').value); }
  function feeNumber() { return Number(($('f-fee').value || '').replace(/[^\d]/g, '')) || 0; }
  function weeksEtc() { return document.querySelector('input[name="weeks"]:checked').value === 'etc'; }
  function readWeeks() {
    if (!weeksEtc()) return radio('weeks');
    var n = Number($('f-weeks-etc').value);
    return Number.isInteger(n) && n >= 1 && n <= K.MAX_WEEKS ? n : 0;
  }

  function readForm() {
    return {
      n: $('f-name').value,
      t: $('f-tel').value,
      a: $('f-apply').value,
      w: readWeeks(),
      s: $('f-start').value,
      e: $('f-end').value,
      r: readRows(),
      f: feeNumber(),
      b: radio('basis'),
      m: $('f-memo').value
    };
  }

  function setMsg(id, text, kind) {
    var m = $(id);
    m.textContent = text || '';
    m.className = 'msg' + (kind ? ' ' + kind : '');
  }

  /* ---------- 확인 메시지 ---------- */
  function check(raw) {
    var tel = raw.t.trim();
    var telBad = tel && !K.phoneNumber(tel);
    $('f-tel').classList.toggle('bad', !!telBad);
    if (telBad) setMsg('tel-msg', '전화번호를 확인해 주세요. 숫자와 하이픈(-)으로 입력합니다.', 'err');
    else setMsg('tel-msg', '');

    var etcVal = $('f-weeks-etc').value.trim();
    var etcBad = weeksEtc() && etcVal !== '' && !readWeeks();
    $('f-weeks-etc').classList.toggle('bad', etcBad);
    if (etcBad) setMsg('weeks-msg', '1~' + K.MAX_WEEKS + ' 사이의 숫자로 넣어 주세요.', 'err');
    else if (weeksEtc() && etcVal === '') setMsg('weeks-msg', '주차를 숫자로 넣어 주세요. 비워 두면 주차가 나오지 않습니다.', 'warn');
    else setMsg('weeks-msg', '');

    var ap = raw.a.trim();
    var apBad = ap && !K.safeUrl(ap);
    $('f-apply').classList.toggle('bad', !!apBad);
    setMsg('apply-msg', apBad ? 'https://로 시작하는 주소를 넣어 주세요.' : '', apBad ? 'err' : '');

    if (raw.s && raw.e && raw.e < raw.s) setMsg('date-msg', '종료일이 시작일보다 앞입니다. 날짜를 확인해 주세요.', 'err');
    else if ((raw.s && !raw.e) || (!raw.s && raw.e)) setMsg('date-msg', '시작일과 종료일을 모두 넣어야 학부모 화면에 기간이 나옵니다.', 'warn');
    else setMsg('date-msg', '');

    Array.prototype.forEach.call(rowsBox.children, function (row, i) {
      var r = raw.r[i];
      var msg = row.querySelector('.msg');
      if (r[0].length && !r[1].length && !r[2]) msg.textContent = '요일이나 시간을 넣어야 학부모 화면에 나옵니다.';
      else if (!r[0].length && (r[1].length || r[2] || r[4].trim())) msg.textContent = '대상 학년을 골라야 학부모 화면에 나옵니다.';
      else if (r[2] && r[3] && r[3] <= r[2]) msg.textContent = '끝나는 시간이 시작 시간보다 앞입니다.';
      else msg.textContent = '';
    });

    if (!raw.f && raw.m.trim()) setMsg('fee-msg', '금액을 넣어야 비고도 함께 나옵니다.', 'warn');
    else setMsg('fee-msg', '');

    return !telBad && !apBad && !etcBad && !(raw.s && raw.e && raw.e < raw.s);
  }

  /* ---------- 링크 만들기 ---------- */
  var currentUrl = '';
  var previewTimer = null;

  function baseUrl() {
    var u = new URL('index.html', location.href);
    u.search = ''; u.hash = '';
    return u.href;
  }

  function update() {
    $('weeks-etc-box').hidden = !weeksEtc();
    var raw = readForm();
    var ok = check(raw);
    var name = raw.n.trim();
    currentUrl = ok && name ? baseUrl() + '?d=' + K.encode(raw) : '';
    $('no-link').hidden = !!currentUrl;
    $('has-link').hidden = !currentUrl;
    $('no-link').textContent = name ? '빨간 글씨로 표시된 항목을 고치면 링크가 만들어집니다.' : '학원명을 입력하면 링크가 만들어집니다.';
    $('out-link').value = currentUrl;
    $('open-preview').href = currentUrl || '#';
    setMsg('copy-msg', '', 'ok');
    clearTimeout(previewTimer);
    previewTimer = setTimeout(function () {
      var target = currentUrl || baseUrl();
      if ($('preview').src !== target) $('preview').src = target;
    }, 350);
  }

  /* 기타를 고르면 입력 칸으로 */
  document.querySelector('input[name="weeks"][value="etc"]').addEventListener('change', function () {
    setTimeout(function () { $('f-weeks-etc').focus(); }, 0);
  });

  /* 금액에 쉼표 */
  $('f-fee').addEventListener('input', function () {
    var n = feeNumber();
    $('f-fee').value = n ? n.toLocaleString('ko-KR') : '';
  });

  ['f-name', 'f-tel', 'f-apply', 'f-weeks-etc', 'f-start', 'f-end', 'f-fee', 'f-memo'].forEach(function (id) {
    $(id).addEventListener('input', update);
    $(id).addEventListener('change', update);
  });
  document.querySelectorAll('input[name="weeks"],input[name="basis"]').forEach(function (r) { r.addEventListener('change', update); });
  $('add-row').addEventListener('click', function () { addRow(); update(); });

  /* ---------- 복사 ---------- */
  function copy(text, okMsg) {
    function done() { setMsg('copy-msg', okMsg, 'ok'); }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, fallback);
    } else { fallback(); }
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done(); }
      catch (e) { setMsg('copy-msg', '복사하지 못했습니다. 링크 칸을 길게 눌러 직접 복사해 주세요.', 'err'); }
      ta.remove();
    }
  }

  function guideText() {
    var d = K.sanitize(readForm());
    var lines = ['안녕하세요, ' + d.n + '입니다.', '겨울방학 \'일취월장 문해력 특강\'을 안내드립니다.', '교과 독파 · 완독 습관 · 글쓰기 기초, 세 가지를 목표로 하는 겨울방학 특강입니다.'];
    var period = K.periodText(d);
    if (d.w || period) lines.push('· ' + [d.w ? d.w + '주 과정' : '', period].filter(Boolean).join(', '));
    lines.push('아래 링크에서 수업 내용과 일정을 확인해 주세요.');
    lines.push(currentUrl);
    return lines.join('\n');
  }

  $('copy-link').addEventListener('click', function () { if (currentUrl) copy(currentUrl, '링크를 복사했습니다. 카카오톡이나 문자에 붙여 넣어 보내세요.'); });
  $('copy-text').addEventListener('click', function () { if (currentUrl) copy(guideText(), '안내 문구를 복사했습니다. 인사말은 학원에 맞게 고쳐 보내셔도 됩니다.'); });

  /* ---------- 기존 링크 불러오기 ---------- */
  function fill(d) {
    $('f-name').value = d.n;
    $('f-tel').value = d.t;
    $('f-apply').value = d.a;
    var preset = [0, 4, 6, 8].indexOf(d.w) !== -1;
    document.querySelector('input[name="weeks"][value="' + (preset ? d.w : 'etc') + '"]').checked = true;
    $('f-weeks-etc').value = preset ? '' : d.w;
    $('f-start').value = d.s;
    $('f-end').value = d.e;
    rowsBox.innerHTML = '';
    if (d.r.length) d.r.forEach(function (r) { addRow(r); }); else addRow();
    $('f-fee').value = d.f ? d.f.toLocaleString('ko-KR') : '';
    document.querySelector('input[name="basis"][value="' + d.b + '"]').checked = true;
    $('f-memo').value = d.m;
    update();
  }

  $('load-btn').addEventListener('click', function () {
    var v = $('load-input').value.trim();
    var code = v;
    try { code = new URL(v).searchParams.get('d') || ''; } catch (e) { /* 주소가 아니면 코드 자체로 시도 */ }
    var d = code ? K.decode(code) : null;
    if (!d) { setMsg('load-msg', '링크를 읽지 못했습니다. 이 페이지에서 만든 링크를 그대로 붙여 넣어 주세요.', 'err'); return; }
    fill(d);
    setMsg('load-msg', '불러왔습니다. 고친 뒤 아래에서 새 링크를 복사해 주세요.', 'ok');
  });

  addRow();
  update();
})();
