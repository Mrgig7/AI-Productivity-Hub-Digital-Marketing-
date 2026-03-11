/**
 * AI Productivity Hub — Main JS
 * Scroll animations, newsletter, CTA handlers
 */
(function() {
  'use strict';

  // Intersection Observer for scroll animations
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if(e.isIntersecting) { e.target.classList.add('visible'); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.animate-on-scroll').forEach(function(el) {
      observer.observe(el);
    });

    // Newsletter form handling
    var nlForm = document.getElementById('newsletterForm');
    if(nlForm) {
      nlForm.addEventListener('submit', function(e) {
        e.preventDefault();
        var email = nlForm.querySelector('input[type="email"]');
        if(email && email.value) {
          if(window.Analytics) Analytics.trackNewsletterSignup();
          showToast('Thanks for subscribing! 🎉');
          email.value = '';
        }
      });
    }

    // CTA button tracking
    document.querySelectorAll('[data-cta]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        if(window.Analytics) Analytics.trackCTAClick(this.getAttribute('data-cta'));
      });
    });
  });

  // Toast utility
  window.showToast = function(msg) {
    var existing = document.querySelector('.toast');
    if(existing) existing.remove();
    var t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(function() { t.classList.add('show'); });
    setTimeout(function() { t.classList.remove('show'); setTimeout(function(){ t.remove(); }, 400); }, 3000);
  };
})();
