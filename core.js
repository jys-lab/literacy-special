/* 일취월장 문해력 특강 · 공통 기능
   학원 정보를 링크 주소(?d=)에 짧게 암호화해 담고, 다시 꺼내 읽는다.
   서버 없이 동작하며, 학부모 페이지(index.html)와 링크 만들기(maker.html)가 함께 쓴다. */
(function () {
  'use strict';

  var GRADES = [3, 4, 5, 6];
  var DAYS = ['월', '화', '수', '목', '금', '토'];
  var WEEKDAY = ['일', '월', '화', '수', '목', '금', '토'];
  var RECOMMENDED_SESSIONS = { 4: 18, 6: 27 };

  /* 입력 예시(원장님 공지용). 학원명·연락처·금액은 모두 가상 값 */
  var SAMPLE = {
    n: '예시학원',
    t: '000-0000-0000',
    a: '',
    w: 8,
    c: 0,
    s: '2027-01-04',
    e: '2027-02-26',
    r: [[[3, 4], [0, 2], '16:00', '17:20'], [[5, 6], [1, 3], '17:30', '18:50']],
    f: 300000,
    b: 0,
    m: '교재비 별도'
  };

  function phoneNumber(value) {
    if (!value || !/^\+?[0-9 ()-]+$/.test(value)) return '';
    var number = value.replace(/[ ()-]/g, '');
    return /^\+?\d{7,15}$/.test(number) ? number : '';
  }

  function safeUrl(value) {
    if (!value) return '';
    try {
      var u = new URL(String(value).trim());
      return u.protocol === 'https:' && String(value).length <= 500 ? u.href : '';
    } catch (e) { return ''; }
  }

  function validDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return '';
    var d = new Date(value + 'T00:00:00Z');
    return isNaN(d) || d.toISOString().slice(0, 10) !== value ? '' : value;
  }

  function validTime(value) {
    return /^([01]\d|2[0-3]):[0-5]\d$/.test(value || '') ? value : '';
  }

  function str(value, max) {
    return typeof value === 'string' ? value.trim().slice(0, max) : '';
  }

  function uniqueSorted(list, allowed) {
    if (!Array.isArray(list)) return [];
    var out = [];
    list.forEach(function (v) { if (allowed.indexOf(v) !== -1 && out.indexOf(v) === -1) out.push(v); });
    return out.sort(function (a, b) { return a - b; });
  }

  /* 어떤 값이 들어와도 안전한 형태로 정리 */
  function sanitize(raw) {
    raw = raw && typeof raw === 'object' ? raw : {};
    var d = {
      n: str(raw.n, 40),
      t: str(raw.t, 25),
      a: safeUrl(raw.a),
      w: [4, 6, 8].indexOf(raw.w) !== -1 ? raw.w : 0,
      c: 0,
      s: validDate(raw.s),
      e: validDate(raw.e),
      r: [],
      f: 0,
      b: raw.b === 1 ? 1 : 0,
      m: str(raw.m, 30)
    };
    if (!phoneNumber(d.t)) d.t = '';
    if ((d.w === 4 || d.w === 6) && Number.isInteger(raw.c) && raw.c > 0 && raw.c < 100) d.c = raw.c;
    if (d.s && d.e && d.e < d.s) { d.s = ''; d.e = ''; }
    if (Number.isInteger(raw.f) && raw.f > 0 && raw.f < 100000000) d.f = raw.f;
    var used = [];
    (Array.isArray(raw.r) ? raw.r : []).slice(0, 4).forEach(function (row) {
      if (!Array.isArray(row)) return;
      var grades = uniqueSorted(row[0], GRADES).filter(function (g) { return used.indexOf(g) === -1; });
      var days = uniqueSorted(row[1], [0, 1, 2, 3, 4, 5]);
      var start = validTime(row[2]);
      var end = validTime(row[3]);
      if (start && end && end <= start) end = '';
      if (!grades.length) return;
      used = used.concat(grades);
      d.r.push([grades, days, start, end]);
    });
    return d;
  }

  /* 비어 있는 항목은 빼고 짧게 */
  function compact(d) {
    var o = { v: 1, n: d.n };
    if (d.t) o.t = d.t;
    if (d.a) o.a = d.a;
    if (d.w) o.w = d.w;
    if (d.c) o.c = d.c;
    if (d.s) o.s = d.s;
    if (d.e) o.e = d.e;
    if (d.r.length) o.r = d.r;
    if (d.f) { o.f = d.f; if (d.b) o.b = 1; }
    if (d.m) o.m = d.m;
    return o;
  }

  function encode(data) {
    var json = JSON.stringify(compact(sanitize(data)));
    var bytes = new TextEncoder().encode(json);
    var bin = '';
    bytes.forEach(function (b) { bin += String.fromCharCode(b); });
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  function decode(code) {
    try {
      var b64 = String(code).replace(/-/g, '+').replace(/_/g, '/');
      while (b64.length % 4) b64 += '=';
      var bin = atob(b64);
      var bytes = new Uint8Array(bin.length);
      for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      var d = sanitize(JSON.parse(new TextDecoder().decode(bytes)));
      return d.n ? d : null;
    } catch (e) { return null; }
  }

  /* 화면 표시용 글자 만들기 */
  function dateText(value, withYear) {
    var d = new Date(value + 'T00:00:00Z');
    var t = (d.getUTCMonth() + 1) + '월 ' + d.getUTCDate() + '일(' + WEEKDAY[d.getUTCDay()] + ')';
    return withYear ? d.getUTCFullYear() + '년 ' + t : t;
  }

  function periodText(d) {
    if (!d.s || !d.e) return '';
    var sameYear = d.s.slice(0, 4) === d.e.slice(0, 4);
    return dateText(d.s, true) + ' ~ ' + dateText(d.e, !sameYear);
  }

  function gradeText(grades) {
    return '예비 ' + grades.map(function (g) { return '초' + g; }).join('·');
  }

  function dayText(days) {
    return days.map(function (i) { return DAYS[i]; }).join('·');
  }

  function timeText(start, end) {
    if (start && end) return start + '~' + end;
    return start ? start + ' 시작' : '';
  }

  function feeText(d) {
    if (!d.f) return '';
    var won = d.f.toLocaleString('ko-KR') + '원';
    return d.b === 1 ? '월 ' + won : won + ' (전체 과정)';
  }

  function sessionsText(d) {
    if (d.w === 8) return '새 학년 1학기 전반부 36회차 완주 목표';
    if ((d.w === 4 || d.w === 6) && d.c) return d.w + '주 동안 ' + d.c + '회차 학습';
    return '';
  }

  /* 학년별 일정 중 표시할 줄: 학년 + (요일 또는 시간) */
  function visibleRows(d) {
    return d.r.filter(function (row) { return row[0].length && (row[1].length || row[2]); });
  }

  function hasSchedule(d) {
    return !!(d.w || periodText(d) || visibleRows(d).length || d.f);
  }

  window.ILJWI = {
    GRADES: GRADES, DAYS: DAYS, SAMPLE: SAMPLE, RECOMMENDED_SESSIONS: RECOMMENDED_SESSIONS,
    phoneNumber: phoneNumber, safeUrl: safeUrl, sanitize: sanitize,
    encode: encode, decode: decode,
    periodText: periodText, gradeText: gradeText, dayText: dayText, timeText: timeText,
    feeText: feeText, sessionsText: sessionsText, visibleRows: visibleRows, hasSchedule: hasSchedule
  };
})();
