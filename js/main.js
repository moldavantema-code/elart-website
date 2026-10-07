// ELART — shared site script (header, mobile menu, inquiry forms)
(function () {
  var $ = function (id) { return document.getElementById(id); };

  // Header: transparent over the hero, solid after scrolling
  var hdr = $('hdr'), mnav = $('mnav'), burger = $('burger');
  function syncHeader() {
    if (hdr) hdr.classList.toggle('solid', window.scrollY > 40 || (mnav && !mnav.hidden));
  }
  window.addEventListener('scroll', syncHeader, { passive: true });
  syncHeader();

  // Mobile menu
  if (burger && mnav) {
    burger.addEventListener('click', function () {
      mnav.hidden = !mnav.hidden;
      burger.setAttribute('aria-expanded', String(!mnav.hidden));
      syncHeader();
    });
    mnav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        mnav.hidden = true;
        burger.setAttribute('aria-expanded', 'false');
        syncHeader();
      }
    });
  }

  // Field check helper: shows the message under the field when the test fails
  function check(id, msg, test) {
    var el = $(id), err = $('e-' + id);
    if (!el) return true;
    var ok = test(el.value.trim());
    if (err) err.textContent = ok ? '' : msg;
    return ok;
  }
  var isEmail = function (x) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(x); };

  // Two-step form (homepage)
  var next = $('next'), back = $('back'), s1 = $('s1'), s2 = $('s2'), p1 = $('p1'), p2 = $('p2');
  if (next && s1 && s2) {
    next.addEventListener('click', function () {
      var ok = [
        check('name', 'Enter your name.', function (x) { return x.length > 1; }),
        check('email', 'Enter an email like name@example.com.', isEmail),
        check('date', 'Choose the date.', function (x) { return !!x; }),
        check('type', 'Choose the occasion.', function (x) { return !!x; })
      ].every(Boolean);
      if (!ok) return;
      s1.hidden = true; s2.hidden = false;
      p1.classList.remove('on'); p2.classList.add('on');
      var first = $('venue'); if (first) first.focus();
    });
  }
  if (back && s1 && s2) {
    back.addEventListener('click', function () {
      s2.hidden = true; s1.hidden = false;
      p2.classList.remove('on'); p1.classList.add('on');
    });
  }

  // Submit
  // TODO: connect to GoHighLevel. Easiest: replace this <form> with the GHL form embed,
  // or POST the fields to a GHL inbound webhook URL (see README.md).
  var form = $('form'), thanks = $('thanks');
  if (form && thanks) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.dataset.form === 'yacht') {
        var ok = [
          check('date', 'Choose the charter date.', function (x) { return !!x; }),
          check('guests', 'Enter the number of guests.', function (x) { return +x > 0; }),
          check('name', 'Enter your name.', function (x) { return x.length > 1; }),
          check('phone', 'Enter a phone number so we can text the quote.', function (x) { return x.replace(/\D/g, '').length >= 10; })
        ].every(Boolean);
        if (!ok) return;
      }
      var name = $('name');
      $('tname').textContent = name ? name.value.trim().split(' ')[0] : '';
      form.hidden = true; thanks.hidden = false;
    });
  }
})();
