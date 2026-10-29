// ELART — Google tag (GA4 + Google Ads) and Meta Pixel, loaded only after the visitor accepts cookies.
// Paste the real IDs below. While both are empty, nothing loads and no banner is shown.
(function () {
  var GA_ID = 'G-1T8EMZVP1Q';  // GA4 Measurement ID
  var PIXEL_ID = '';   // Meta Pixel ID, 15–16 digits, e.g. '123456789012345'
  var ADS_ID = 'AW-18542997224';  // Google Ads account (Conversion ID)
  // Google Ads conversion "Отправка формы для потенциальных клиентов": paste the exact send_to value
  // from Google Ads → Goals → Conversions → this action → Tag setup → Event snippet, e.g. 'AW-18542997224/AbCdEfGhIjk'.
  // While empty, no Google Ads conversion is sent.
  var ADS_LEAD_SEND_TO = 'AW-18542997224/tL2yCKXCwa4dEOjd_olF';

  var KEY = 'elart-cookie-consent';
  function getChoice() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function setChoice(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  function load() {
    if (window.__elartTagsLoaded) return;
    window.__elartTagsLoaded = true;
    var TAG_ID = GA_ID || ADS_ID;  // one gtag.js for both GA4 and Google Ads
    if (TAG_ID) {
      var s = document.createElement('script');
      s.async = true;
      s.src = 'https://www.googletagmanager.com/gtag/js?id=' + TAG_ID;
      document.head.appendChild(s);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      if (GA_ID) window.gtag('config', GA_ID);
      if (ADS_ID) window.gtag('config', ADS_ID);
    }
    if (PIXEL_ID) {
      !function (f, b, e, v, n, t, s) {
        if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
        if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
        t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
      }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      window.fbq('init', PIXEL_ID);
      window.fbq('track', 'PageView');
    }
  }

  // Called by main.js only after an inquiry form is sent successfully.
  window.elartTrackLead = function (formName) {
    if (window.__elartLeadTracked) return;  // at most once per page view
    window.__elartLeadTracked = true;
    if (window.gtag) window.gtag('event', 'generate_lead', { event_category: formName || 'inquiry_form' });
    if (window.gtag && ADS_LEAD_SEND_TO) window.gtag('event', 'conversion', { send_to: ADS_LEAD_SEND_TO });
    if (window.fbq) window.fbq('track', 'Lead');
  };

  if (!GA_ID && !PIXEL_ID && !ADS_ID) { window.elartCookieSettings = function () {}; return; }

  var banner;
  function close() { if (banner) { banner.remove(); banner = null; } document.body.classList.remove('cc-open'); }
  function showBanner() {
    if (banner) return;
    banner = document.createElement('div');
    banner.className = 'cc';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookie preferences');
    banner.innerHTML = '<p>We use cookies for analytics and ad measurement. ' +
      '<a href="/privacy">Privacy policy</a></p>' +
      '<div class="cc-b"><button type="button" class="btn" data-v="yes">Accept</button>' +
      '<button type="button" class="btn ghost" data-v="no">Decline</button></div>';
    banner.addEventListener('click', function (e) {
      var v = e.target.getAttribute && e.target.getAttribute('data-v');
      if (!v) return;
      setChoice(v); close();
      if (v === 'yes') load();
    });
    document.body.appendChild(banner);
    document.body.classList.add('cc-open');
  }
  window.elartCookieSettings = function () { setChoice(''); showBanner(); };

  var c = getChoice();
  if (c === 'yes') load();
  else if (c !== 'no') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', showBanner);
    else showBanner();
  }
})();
