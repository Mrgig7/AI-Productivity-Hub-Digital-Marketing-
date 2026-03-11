/**
 * AI Productivity Hub — Shared Components
 * Navbar and Footer injected on every page
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

  // Navbar HTML
  var nav = '<nav class="navbar" id="navbar">' +
    '<div class="container">' +
      '<a href="index.html" class="navbar-brand">' +
        '<span class="logo-icon">⚡</span> AI Productivity Hub' +
      '</a>' +
      '<div class="nav-links" id="navLinks">' +
        '<a href="index.html" class="'+active('home')+'">Home</a>' +
        '<a href="tools.html" class="'+active('tools')+'">Tools</a>' +
        '<a href="blog.html" class="'+active('blog')+'">Blog</a>' +
        '<a href="pricing.html" class="'+active('pricing')+'">Pricing</a>' +
        '<a href="contact.html" class="'+active('contact')+'">Contact</a>' +
        '<a href="pricing.html" class="nav-cta" data-cta="nav-get-started">Get Started</a>' +
      '</div>' +
      '<div class="hamburger" id="hamburger">' +
        '<span></span><span></span><span></span>' +
      '</div>' +
    '</div>' +
  '</nav>';

  // Footer HTML
  var foot = '<footer class="footer">' +
    '<div class="container">' +
      '<div class="footer-grid">' +
        '<div class="footer-brand">' +
          '<a href="index.html" class="navbar-brand"><span class="logo-icon">⚡</span> AI Productivity Hub</a>' +
          '<p>Empowering professionals and students with AI-driven productivity tools to work smarter, not harder.</p>' +
        '</div>' +
        '<div class="footer-col"><h4>Product</h4>' +
          '<a href="tools.html">Tools</a><a href="pricing.html">Pricing</a><a href="blog.html">Blog</a>' +
        '</div>' +
        '<div class="footer-col"><h4>Company</h4>' +
          '<a href="contact.html">Contact</a><a href="#">About</a><a href="#">Careers</a>' +
        '</div>' +
        '<div class="footer-col"><h4>Legal</h4>' +
          '<a href="#">Privacy Policy</a><a href="#">Terms of Service</a><a href="#">Cookie Policy</a>' +
        '</div>' +
      '</div>' +
      '<div class="footer-bottom">' +
        '<span>&copy; 2026 AI Productivity Hub. All rights reserved.</span>' +
        '<div class="footer-social">' +
          '<a href="#" aria-label="Twitter">𝕏</a>' +
          '<a href="#" aria-label="LinkedIn">in</a>' +
          '<a href="#" aria-label="GitHub">⌨</a>' +
        '</div>' +
      '</div>' +
    '</div>' +
  '</footer>';

  // Inject
  document.body.insertAdjacentHTML('afterbegin', nav);
  document.body.insertAdjacentHTML('beforeend', foot);

  // Hamburger toggle
  var hamburger = document.getElementById('hamburger');
  var navLinks = document.getElementById('navLinks');
  if(hamburger) {
    hamburger.addEventListener('click', function() {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
    });
    // Close on link click
    navLinks.querySelectorAll('a').forEach(function(a) {
      a.addEventListener('click', function() {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });
  }

  // Sticky navbar scroll effect
  window.addEventListener('scroll', function() {
    var nb = document.getElementById('navbar');
    if(nb) { nb.classList.toggle('scrolled', window.scrollY > 50); }
  }, {passive:true});

  // Track nav CTA
  var navCta = document.querySelector('.nav-cta');
  if(navCta && window.Analytics) {
    navCta.addEventListener('click', function() {
      Analytics.trackCTAClick('nav-get-started');
    });
  }
})();
