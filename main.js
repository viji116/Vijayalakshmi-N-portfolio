// assets/js/main.js
document.addEventListener('DOMContentLoaded', function () {
  const btn = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (btn) {
    btn.addEventListener('click', () => {
      links.style.display = links.style.display === 'flex' ? 'none' : 'flex';
    });
  }

  // Simple smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      const id = this.getAttribute('href').substring(1);
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // EmailJS contact form integration
  const EMAILJS_SERVICE_ID = 'service_zf7olvn';
  const EMAILJS_TEMPLATE_ID = 'template_lqrmrm5';
  const EMAILJS_PUBLIC_KEY = 'F3YUHd0hIIBLL1Sip';

  // Load EmailJS SDK dynamically
  function loadEmailJs(cb) {
    if (window.emailjs) return cb();
    const s = document.createElement('script');
    s.src = 'https://cdn.emailjs.com/sdk/3.2.0/email.min.js';
    s.onload = cb;
    document.head.appendChild(s);
  }

  loadEmailJs(function () {
    if (window.emailjs && !emailjs.__initialized) {
      try { emailjs.init(EMAILJS_PUBLIC_KEY); emailjs.__initialized = true } catch (e) { console.warn('EmailJS init failed', e) }
    }

    const form = document.getElementById('contactForm');
    const status = document.getElementById('contactStatus');
    if (form) {
      form.addEventListener('submit', function (evt) {
        evt.preventDefault();
        if (!window.emailjs) {
          if (status) { status.style.display = 'inline'; status.textContent = 'Email service unavailable'; }
          console.error('EmailJS not loaded');
          return;
        }
        const submitBtn = form.querySelector('button[type="submit"]');
        const data = new FormData(form);
        const templateParams = {};
        for (const [k, v] of data.entries()) templateParams[k] = v;

        // show sending and disable submit
        if (submitBtn) submitBtn.disabled = true;
        if (status) { status.style.display = 'inline'; status.textContent = 'Sending…'; }
        console.debug('EmailJS sending', EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);

        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
          .then(function (response) {
            console.debug('EmailJS response', response);
            if (status) { status.textContent = 'Message sent — thank you!'; }
            form.reset();
            setTimeout(() => { if (status) status.style.display = 'none' }, 4000);
          }, function (err) {
            console.error('EmailJS error', err);
            let msg = 'Failed to send — try later.';
            try { if (err && err.text) msg = err.text } catch (e) { }
            if (status) { status.textContent = msg + ' (see console for details)'; }
          })
          .finally(() => { if (submitBtn) submitBtn.disabled = false; });
      });
    }
  });
});
