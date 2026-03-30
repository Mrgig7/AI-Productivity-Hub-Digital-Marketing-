/**
 * AI Productivity Hub — Shared Components
 * Navbar, Footer, Cookie Banner — injected on every page
 * Includes GA4 tracking for navigation clicks, footer links, and consent
 */

(function() {
  'use strict';

  // Determine active page
  var path = location.pathname;
  var page = 'home';
  if(path.includes('tools')) page='tools';
  else if(path.includes('blog')) page='blog';
  else if(path.includes('pricing')) page='pricing';
  else if(path.includes('contact')) page='contact';

  function active(p) { return page===p ? 'active' : ''; }

  // ═══════════════════════════════════════
  // NAVBAR
  // ═══════════════════════════════════════
  var nav = '<nav class="navbar" id="navbar">' +
    '<div class="container">' +
      '<a href="index.html" class="navbar-brand">' +
        '<span class="logo-icon">⚡</span> AI Productivity Hub' +
      '</a>' +
      '<div class="nav-links" id="navLinks">' +
        '<a href="index.html" class="'+active('home')+'" data-nav="home">Home</a>' +
        '<a href="tools.html" class="'+active('tools')+'" data-nav="tools">Tools</a>' +
        '<a href="blog.html" class="'+active('blog')+'" data-nav="blog">Blog</a>' +
        '<a href="pricing.html" class="'+active('pricing')+'" data-nav="pricing">Pricing</a>' +
        '<a href="contact.html" class="'+active('contact')+'" data-nav="contact">Contact</a>' +
        '<a href="pricing.html" class="nav-cta" data-cta="nav-get-started" data-nav="get-started">Get Started</a>' +
      '</div>' +
      '<div class="hamburger" id="hamburger">' +
        '<span></span><span></span><span></span>' +
      '</div>' +
    '</div>' +
  '</nav>';

  // ═══════════════════════════════════════
  // FOOTER
  // ═══════════════════════════════════════
  var foot = '<footer class="footer">' +
    '<div class="container">' +
      '<div class="footer-grid">' +
        '<div class="footer-brand">' +
          '<a href="index.html" class="navbar-brand"><span class="logo-icon">⚡</span> AI Productivity Hub</a>' +
          '<p>Empowering professionals and students with AI-driven productivity tools to work smarter, not harder.</p>' +
        '</div>' +
        '<div class="footer-col"><h4>Product</h4>' +
          '<a href="tools.html" data-footer="product">Tools</a>' +
          '<a href="pricing.html" data-footer="product">Pricing</a>' +
          '<a href="blog.html" data-footer="product">Blog</a>' +
        '</div>' +
        '<div class="footer-col"><h4>Company</h4>' +
          '<a href="contact.html" data-footer="company">Contact</a>' +
          '<a href="#" data-footer="company">About</a>' +
          '<a href="#" data-footer="company">Careers</a>' +
        '</div>' +
        '<div class="footer-col"><h4>Legal</h4>' +
          '<a href="#" data-footer="legal">Privacy Policy</a>' +
          '<a href="#" data-footer="legal">Terms of Service</a>' +
          '<a href="#" data-footer="legal">Cookie Policy</a>' +
        '</div>' +
      '</div>' +
      '<div class="footer-bottom">' +
        '<span>&copy; 2026 AI Productivity Hub. All rights reserved.</span>' +
        '<div class="footer-social">' +
          '<a href="#" aria-label="Twitter" data-social="twitter">𝕏</a>' +
          '<a href="#" aria-label="LinkedIn" data-social="linkedin">in</a>' +
          '<a href="#" aria-label="GitHub" data-social="github">⌨</a>' +
        '</div>' +
      '</div>' +
    '</div>' +
  '</footer>';

  // ═══════════════════════════════════════
  // COOKIE CONSENT BANNER
  // ═══════════════════════════════════════
  var cookieBanner = '';
  if (!localStorage.getItem('aph_consent')) {
    cookieBanner = '<div class="cookie-banner" id="cookieBanner">' +
      '<div class="cookie-banner-inner">' +
        '<div class="cookie-text">' +
          '<span class="cookie-icon">🍪</span>' +
          '<div>' +
            '<strong>We value your privacy</strong>' +
            '<p>We use cookies and analytics to improve your experience. You can choose which cookies to accept.</p>' +
          '</div>' +
        '</div>' +
        '<div class="cookie-actions">' +
          '<button class="btn btn-sm btn-outline" onclick="handleConsentAnalytics()">Analytics Only</button>' +
          '<button class="btn btn-sm btn-primary" onclick="handleConsentAll()">Accept All</button>' +
          '<button class="btn btn-sm btn-ghost" onclick="handleConsentDeny()">Deny</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  // Inject components
  document.body.insertAdjacentHTML('afterbegin', nav);
  document.body.insertAdjacentHTML('beforeend', foot);
  if (cookieBanner) {
    document.body.insertAdjacentHTML('beforeend', cookieBanner);
    // Animate in after a brief delay
    setTimeout(function() {
      var banner = document.getElementById('cookieBanner');
      if (banner) banner.classList.add('visible');
    }, 1500);
  }

  // ═══════════════════════════════════════
  // CONSENT HANDLERS
  // ═══════════════════════════════════════
  window.handleConsentAll = function() {
    if(window.Analytics) Analytics.grantFullConsent();
    dismissCookieBanner();
  };
  window.handleConsentAnalytics = function() {
    if(window.Analytics) Analytics.grantAnalyticsOnly();
    dismissCookieBanner();
  };
  window.handleConsentDeny = function() {
    if(window.Analytics) Analytics.denyAllConsent();
    dismissCookieBanner();
  };

  function dismissCookieBanner() {
    var banner = document.getElementById('cookieBanner');
    if (banner) {
      banner.classList.remove('visible');
      banner.classList.add('dismissed');
      setTimeout(function() { banner.remove(); }, 400);
    }
  }

  // ═══════════════════════════════════════
  // HAMBURGER TOGGLE
  // ═══════════════════════════════════════
  var hamburger = document.getElementById('hamburger');
  var navLinks = document.getElementById('navLinks');
  if(hamburger) {
    hamburger.addEventListener('click', function() {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(function(a) {
      a.addEventListener('click', function() {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });
  }

  // ═══════════════════════════════════════
  // STICKY NAVBAR
  // ═══════════════════════════════════════
  window.addEventListener('scroll', function() {
    var nb = document.getElementById('navbar');
    if(nb) nb.classList.toggle('scrolled', window.scrollY > 50);
  }, {passive:true});

  // ═══════════════════════════════════════
  // NAVIGATION CLICK TRACKING
  // ═══════════════════════════════════════
  document.querySelectorAll('[data-nav]').forEach(function(link) {
    link.addEventListener('click', function() {
      if(window.Analytics) {
        Analytics.trackNavClick(this.getAttribute('data-nav'), page);
      }
    });
  });

  // Track nav CTA
  var navCta = document.querySelector('.nav-cta');
  if(navCta && window.Analytics) {
    navCta.addEventListener('click', function() {
      Analytics.trackCTAClick('nav-get-started');
    });
  }

  // ═══════════════════════════════════════
  // FOOTER LINK TRACKING
  // ═══════════════════════════════════════
  document.querySelectorAll('[data-footer]').forEach(function(link) {
    link.addEventListener('click', function() {
      if(window.Analytics) {
        Analytics.trackFooterClick(
          this.getAttribute('data-footer'),
          this.textContent.trim()
        );
      }
    });
  });

  // ═══════════════════════════════════════
  // SOCIAL LINK TRACKING
  // ═══════════════════════════════════════
  document.querySelectorAll('[data-social]').forEach(function(link) {
    link.addEventListener('click', function() {
      if(window.Analytics) {
        Analytics.trackSocialClick(this.getAttribute('data-social'));
      }
    });
  });

})();
