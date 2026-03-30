/**
 * AI Productivity Hub — Main JS
 * Scroll animations, newsletter, CTA handlers, feature/testimonial tracking
 */
(function() {
  'use strict';

  // ═══════════════════════════════════════
  // INTERSECTION OBSERVER — Scroll Animations
  // ═══════════════════════════════════════
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if(e.isIntersecting) { e.target.classList.add('visible'); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  // Testimonial visibility observer (tracks when testimonials scroll into view)
  var testimonialObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if(e.isIntersecting && !e.target.dataset.tracked) {
        e.target.dataset.tracked = 'true';
        var name = e.target.querySelector('.testimonial-name');
        if(name && window.Analytics) {
          Analytics.trackTestimonialView(name.textContent.trim());
        }
      }
    });
  }, { threshold: 0.5 });

  // Feature card visibility observer (tracks feature interest)
  var featureObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if(e.isIntersecting && !e.target.dataset.tracked) {
        e.target.dataset.tracked = 'true';
        var title = e.target.querySelector('h3');
        if(title && window.Analytics) {
          Analytics.trackFeatureInterest(title.textContent.trim());
        }
      }
    });
  }, { threshold: 0.6 }); // 60% visible = genuine interest

  document.addEventListener('DOMContentLoaded', function() {
    // Scroll animation
    document.querySelectorAll('.animate-on-scroll').forEach(function(el) {
      observer.observe(el);
    });

    // Track testimonial views
    document.querySelectorAll('.testimonial-card').forEach(function(card) {
      testimonialObserver.observe(card);
    });

    // Track feature card interest (homepage)
    document.querySelectorAll('#features .card').forEach(function(card) {
      featureObserver.observe(card);
    });

    // ═══════════════════════════════════════
    // NEWSLETTER FORM
    // ═══════════════════════════════════════
    var nlForms = document.querySelectorAll('#newsletterForm');
    nlForms.forEach(function(nlForm) {
      nlForm.addEventListener('submit', function(e) {
        e.preventDefault();
        var email = nlForm.querySelector('input[type="email"]');
        if(email && email.value) {
          if(window.Analytics) Analytics.trackNewsletterSignup();
          showToast('Thanks for subscribing! 🎉');
          email.value = '';
        }
      });
    });

    // ═══════════════════════════════════════
    // CTA BUTTON TRACKING (data-cta)
    // ═══════════════════════════════════════
    document.querySelectorAll('[data-cta]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        if(window.Analytics) Analytics.trackCTAClick(this.getAttribute('data-cta'));
      });
    });
  });

  // ═══════════════════════════════════════
  // TOAST UTILITY
  // ═══════════════════════════════════════
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
