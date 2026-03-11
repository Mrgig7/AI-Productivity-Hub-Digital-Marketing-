/**
 * AI Productivity Hub — Analytics Utility
 * Google Analytics 4 (gtag.js) Integration
 * 
 * HOW TO SET UP:
 * 1. Replace 'G-8ZR0M011HR' below with your GA4 Measurement ID
 * 2. Find it in GA4: Admin > Data Streams > Measurement ID
 * 3. Test: enable DebugView in GA4 and add ?debug_mode=true to URL
 */

// TODO: Replace with your GA4 Measurement ID
const GA_MEASUREMENT_ID = 'G-8ZR0M011HR';
const ANALYTICS_DEBUG = GA_MEASUREMENT_ID === 'G-XXXXXXXXXX';

// DataLayer init
window.dataLayer = window.dataLayer || [];
function gtag() { window.dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', GA_MEASUREMENT_ID, { send_page_view: true, debug_mode: ANALYTICS_DEBUG });

// UTM Capture
(function() {
  const p = new URLSearchParams(location.search);
  const keys = ['utm_source','utm_medium','utm_campaign','utm_term','utm_content'];
  const d = {}; let has = false;
  keys.forEach(k => { const v = p.get(k); if(v){ d[k]=v; has=true; }});
  if(has){ sessionStorage.setItem('utm_data', JSON.stringify(d)); }
})();

function getUTMData() {
  try { return JSON.parse(sessionStorage.getItem('utm_data')) || {}; } catch(e) { return {}; }
}

// A/B Variant
(function() {
  const v = new URLSearchParams(location.search).get('variant');
  if(v) sessionStorage.setItem('ab_variant', v);
})();

function getVariant() { return sessionStorage.getItem('ab_variant') || null; }

// Core tracker
function trackEvent(name, params, isConversion) {
  params = params || {};
  params.page_location = location.href;
  params.page_title = document.title;
  var v = getVariant(); if(v) params.ab_variant = v;
  if(isConversion) Object.assign(params, getUTMData());
  gtag('event', name, params);
  if(ANALYTICS_DEBUG) console.log('%c[Analytics] '+name, 'color:#6366f1;font-weight:bold', params);
}

// Predefined events
function trackCTAClick(btn) { trackEvent('cta_click', {button_name:btn}); }
function trackToolUsed(tool, action) { trackEvent('tool_used', {tool_name:tool, action_type:action}); }
function trackBlogClick(title) { trackEvent('blog_click', {blog_title:title}); }
function trackNewsletterSignup() { trackEvent('newsletter_signup', {}, true); }
function trackPlanSelected(plan) { trackEvent('plan_selected', {plan_name:plan}, true); }
function trackContactSubmitted() { trackEvent('contact_submitted', {}, true); }

// Scroll depth tracking
(function() {
  var thresholds = [25,50,75,100], tracked = {};
  function check() {
    var h = document.documentElement.scrollHeight - innerHeight;
    var pct = h <= 0 ? 100 : Math.round((scrollY/h)*100);
    thresholds.forEach(function(t) {
      if(pct >= t && !tracked[t]) { tracked[t]=true; trackEvent('scroll_depth',{percentage_scrolled:t}); }
    });
  }
  var to; addEventListener('scroll', function(){ if(!to) to=setTimeout(function(){ check(); to=null; },200); }, {passive:true});
  addEventListener('load', check);
})();

// Time on page
(function() {
  var start = performance.now();
  addEventListener('beforeunload', function() {
    trackEvent('time_on_page', {seconds: Math.round((performance.now()-start)/1000), page_path: location.pathname});
  });
})();

// Export
window.Analytics = { trackEvent:trackEvent, trackCTAClick:trackCTAClick, trackToolUsed:trackToolUsed, trackBlogClick:trackBlogClick, trackNewsletterSignup:trackNewsletterSignup, trackPlanSelected:trackPlanSelected, trackContactSubmitted:trackContactSubmitted, getUTMData:getUTMData, getVariant:getVariant, ANALYTICS_DEBUG:ANALYTICS_DEBUG };
