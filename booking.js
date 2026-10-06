/* Style Tales by Salma - booking flow
   To change the WhatsApp number, edit WHATSAPP below
   (country code + number, no "+" and no spaces). */
(function () {
  var WHATSAPP = '254726246681';
  var DAYS_AHEAD = 14;
  var STORE_KEY = 'styletales_customer';

  var form = document.getElementById('booking');
  var panels = Array.prototype.slice.call(form.querySelectorAll('.panel'));
  var progressText = document.getElementById('progressText');
  var progressFill = document.getElementById('progressFill');
  var titles = ['Services', 'Day and time', 'Your details', 'Check and send'];
  var step = 1;
  var people = 1;
  var lastMessage = '';

  /* ---------- Helpers ---------- */
  function pad(n) { return String(n).padStart(2, '0'); }
  function iso(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function niceDate(isoStr) {
    var d = new Date(isoStr + 'T00:00');
    return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
  }
  function niceTime(t) {
    if (!t) return '';
    var p = t.split(':'), h = +p[0], m = p[1];
    var ap = h >= 12 ? 'pm' : 'am';
    h = h % 12 || 12;
    return h + ':' + m + ' ' + ap;
  }
  function $(id) { return document.getElementById(id); }
  function setError(n, msg) { $('err' + n).textContent = msg || ''; }

  /* ---------- Steps ---------- */
  function show(n, focus) {
    step = n;
    panels.forEach(function (p) { p.hidden = +p.dataset.step !== n; });
    if (n <= 4) {
      progressText.textContent = 'Step ' + n + ' of 4: ' + titles[n - 1];
      progressFill.style.width = (n * 25) + '%';
      progressText.parentElement.hidden = false;
    } else {
      progressText.parentElement.hidden = true;
    }
    if (n === 4) buildSummary();
    var top = form.getBoundingClientRect().top + window.pageYOffset - 100;
    window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' });
    if (focus !== false) {
      var h = panels[n - 1].querySelector('h2');
      if (h) setTimeout(function () { h.focus({ preventScroll: true }); }, 50);
    }
  }

  function selectedServices() {
    return Array.prototype.slice.call(form.querySelectorAll('input[name="service"]:checked')).map(function (i) { return i.value; });
  }
  function selectedDate() {
    var other = $('otherDate').value;
    if (other) return other;
    var picked = form.querySelector('input[name="day"]:checked');
    return picked ? picked.value : '';
  }

  function validate(n) {
    if (n === 1) {
      if (!selectedServices().length) { setError(1, 'Please pick at least one service.'); return false; }
      setError(1); return true;
    }
    if (n === 2) {
      var d = selectedDate();
      if (!d) { setError(2, 'Please pick a day.'); return false; }
      if (d < iso(new Date())) { setError(2, 'That day has passed. Please pick today or a later day.'); return false; }
      if (!$('time').value) { setError(2, 'Please pick a time.'); $('time').focus(); return false; }
      setError(2); return true;
    }
    if (n === 3) {
      var name = $('name'), phone = $('phone');
      name.removeAttribute('aria-invalid'); phone.removeAttribute('aria-invalid');
      if (!name.value.trim()) { name.setAttribute('aria-invalid', 'true'); setError(3, 'Please add your name.'); name.focus(); return false; }
      var digits = phone.value.replace(/\D/g, '');
      if (digits.length < 9 || digits.length > 13) { phone.setAttribute('aria-invalid', 'true'); setError(3, 'Please add a phone number we can reach you on, like 0712 345 678.'); phone.focus(); return false; }
      setError(3); saveCustomer(); return true;
    }
    return true;
  }

  form.addEventListener('click', function (e) {
    var t = e.target.closest('button');
    if (!t) return;
    if (t.hasAttribute('data-next')) { if (validate(step)) show(step + 1); }
    if (t.hasAttribute('data-back')) { show(step - 1); }
    if (t.dataset.edit) { show(+t.dataset.edit); }
  });
  form.addEventListener('submit', function (e) { e.preventDefault(); });
  // Clear the error message as soon as the person fixes something
  form.addEventListener('input', function () { setError(step); });
  form.addEventListener('change', function () { setError(step); });

  /* ---------- Day picker ---------- */
  var daysBox = $('days');
  var today = new Date();
  for (var i = 0; i < DAYS_AHEAD; i++) {
    var d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
    var label = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-GB', { weekday: 'short' });
    var el = document.createElement('label');
    el.className = 'chip';
    el.innerHTML = '<input type="radio" name="day" value="' + iso(d) + '"' + (i === 0 ? ' checked' : '') + '>' +
      '<span><span class="day-name">' + label + '</span><span class="day-num">' + d.getDate() + '</span>' +
      '<span class="day-mon">' + d.toLocaleDateString('en-GB', { month: 'short' }) + '</span></span>';
    daysBox.appendChild(el);
  }
  $('otherDate').min = iso(today);
  $('otherDate').addEventListener('change', function () {
    if (this.value) form.querySelectorAll('input[name="day"]').forEach(function (r) { r.checked = false; });
  });
  daysBox.addEventListener('change', function () { $('otherDate').value = ''; });

  /* ---------- People counter ---------- */
  function setPeople(n) { people = Math.min(10, Math.max(1, n)); $('people').textContent = people; }
  $('minus').addEventListener('click', function () { setPeople(people - 1); });
  $('plus').addEventListener('click', function () { setPeople(people + 1); });

  /* ---------- Remember customer ---------- */
  function saveCustomer() {
    try {
      if ($('remember').checked) localStorage.setItem(STORE_KEY, JSON.stringify({ name: $('name').value.trim(), phone: $('phone').value.trim() }));
      else localStorage.removeItem(STORE_KEY);
    } catch (e) { /* storage blocked: ignore */ }
  }
  try {
    var saved = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
    if (saved) { $('name').value = saved.name || ''; $('phone').value = saved.phone || ''; }
  } catch (e) { /* ignore */ }

  /* ---------- Summary + message ---------- */
  function data() {
    return {
      services: selectedServices(),
      date: selectedDate(),
      time: $('time').value,
      people: people,
      name: $('name').value.trim(),
      phone: $('phone').value.trim(),
      note: $('note').value.trim()
    };
  }
  function esc(s) { return s.replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function buildSummary() {
    var b = data();
    var rows = [
      ['Services', b.services.join(', '), 1],
      ['Day', b.date ? niceDate(b.date) : '', 2],
      ['Time', niceTime(b.time), 2],
      ['People', String(b.people), 2],
      ['Name', b.name, 3],
      ['Phone', b.phone, 3]
    ];
    if (b.note) rows.push(['Note', b.note, 3]);
    $('summary').innerHTML = rows.map(function (r) {
      return '<div class="summary-row"><dt>' + r[0] + '</dt><dd>' + esc(r[1]) + '</dd>' +
        '<button type="button" data-edit="' + r[2] + '" aria-label="Change ' + r[0].toLowerCase() + '">Change</button></div>';
    }).join('');
    lastMessage = message(b);
  }

  function message(b) {
    var lines = [
      'Hi Style Tales, I would like to book a visit.',
      '',
      'Services: ' + b.services.join(', '),
      'Day: ' + niceDate(b.date),
      'Time: ' + niceTime(b.time),
      'People: ' + b.people,
      'Name: ' + b.name,
      'Phone: ' + b.phone
    ];
    if (b.note) lines.push('Note: ' + b.note);
    return lines.join('\n');
  }

  function openWhatsApp() {
    var url = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(lastMessage);
    var w = window.open(url, '_blank', 'noopener');
    if (!w) window.location.href = url; // popup blocked: open in same tab
  }

  $('sendWa').addEventListener('click', function () { openWhatsApp(); show(5); });
  $('retryWa').addEventListener('click', openWhatsApp);

  $('copyBtn').addEventListener('click', function () {
    var done = function () { $('copyMsg').textContent = 'Copied. Paste it in an SMS to 0726 246 681.'; };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(lastMessage).then(done, fallback);
    } else { fallback(); }
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = lastMessage; ta.setAttribute('readonly', ''); ta.style.position = 'absolute'; ta.style.left = '-9999px';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done(); } catch (e) { $('copyMsg').textContent = 'Could not copy. Please call 0726 246 681.'; }
      document.body.removeChild(ta);
    }
  });

  $('newBooking').addEventListener('click', function () {
    form.querySelectorAll('input[name="service"]').forEach(function (c) { c.checked = false; });
    $('time').value = ''; $('otherDate').value = ''; $('note').value = '';
    var first = form.querySelector('input[name="day"]'); if (first) first.checked = true;
    setPeople(1);
    show(1);
  });

  /* ---------- Deep links: booking.html#nails / #hair / #body ---------- */
  if (location.hash) {
    var target = document.querySelector(location.hash);
    if (target && target.classList.contains('group')) {
      setTimeout(function () { target.scrollIntoView({ block: 'center' }); }, 100);
    }
  }
})();
