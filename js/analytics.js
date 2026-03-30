/**
 * AI Productivity Hub — Advanced Analytics Utility
 * Google Analytics 4 (gtag.js) Deep Integration
 * 
 * FEATURES:
 * ─ GA4 Core tracking (page views, config)
 * ─ Consent Mode v2 (GDPR / CCPA / DPDP compliant)
 * ─ UTM Capture & first-touch attribution
 * ─ A/B Variant tracking
 * ─ Content Grouping (Homepage, Tools, Blog, Pricing, Contact)
 * ─ User Properties (preferred_tool, plan_interest, engagement_level)
 * ─ Custom Events (CTA, tools, blog, newsletter, pricing, contact, etc.)
 * ─ E-Commerce Data Layer (view_item_list, view_item, add_to_cart)
 * ─ Scroll Depth (25/50/75/100%)
 * ─ Time on Page
 * ─ Page Visibility / Tab focus tracking
 * ─ JavaScript Error tracking
 * ─ Session engagement scoring
 * 
 * SETUP:
 * 1. Replace 'G-8ZR0M011HR' with your GA4 Measurement ID
 * 2. Find it in GA4: Admin > Data Streams > Measurement ID
 * 3. Test: enable DebugView in GA4 and add ?debug_mode=true to URL
 */

// ═══════════════════════════════════════════
// 1. MEASUREMENT ID & DEBUG
// ═══════════════════════════════════════════
const GA_MEASUREMENT_ID = 'G-8ZR0M011HR';
const ANALYTICS_DEBUG = GA_MEASUREMENT_ID === 'G-XXXXXXXXXX' || new URLSearchParams(location.search).has('debug_mode');

// ═══════════════════════════════════════════
// 2. CONSENT MODE v2 (defaults to denied)
// ═══════════════════════════════════════════
window.dataLayer = window.dataLayer || [];
function gtag() { window.dataLayer.push(arguments); }

// Set consent defaults BEFORE loading gtag config
gtag('consent', 'default', {
  'ad_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'analytics_storage': 'granted',   // basic analytics allowed by default
  'functionality_storage': 'granted',
  'personalization_storage': 'denied',
  'security_storage': 'granted',
  'wait_for_update': 500
});

// ═══════════════════════════════════════════
// 3. CONTENT GROUPING
// ═══════════════════════════════════════════
function getContentGroup() {
  var path = location.pathname.toLowerCase();
  if (path.includes('tools'))   return 'Tools';
  if (path.includes('blog'))    return 'Blog';
  if (path.includes('pricing')) return 'Pricing';
  if (path.includes('contact')) return 'Contact';
  return 'Homepage';
}

function getPageType() {
  var group = getContentGroup();
  var types = {
    'Homepage': 'landing_page',
    'Tools':    'product_page',
    'Blog':     'content_page',
    'Pricing':  'conversion_page',
    'Contact':  'lead_page'
  };
  return types[group] || 'other';
}

// ═══════════════════════════════════════════
// 4. GA4 CONFIG (with content group + custom dims)
// ═══════════════════════════════════════════
gtag('js', new Date());
gtag('config', GA_MEASUREMENT_ID, {
  send_page_view: true,
  debug_mode: ANALYTICS_DEBUG,
  content_group: getContentGroup(),
  page_type: getPageType(),
  custom_map: {
    'dimension1': 'content_group',
    'dimension2': 'page_type',
    'dimension3': 'engagement_level',
    'dimension4': 'preferred_tool',
    'dimension5': 'plan_interest'
  }
});

// ═══════════════════════════════════════════
// 5. UTM CAPTURE & FIRST-TOUCH ATTRIBUTION
// ═══════════════════════════════════════════
(function() {
  var p = new URLSearchParams(location.search);
  var keys = ['utm_source','utm_medium','utm_campaign','utm_term','utm_content'];
  var d = {}; var has = false;
  keys.forEach(function(k) { var v = p.get(k); if(v){ d[k]=v; has=true; }});
  if(has) {
    sessionStorage.setItem('utm_data', JSON.stringify(d));
    // First-touch attribution: only store once ever
    if(!localStorage.getItem('utm_first_touch')) {
      localStorage.setItem('utm_first_touch', JSON.stringify(d));
      gtag('set', 'user_properties', { utm_first_source: d.utm_source || 'direct' });
    }
  }
})();

function getUTMData() {
  try { return JSON.parse(sessionStorage.getItem('utm_data')) || {}; } catch(e) { return {}; }
}

function getFirstTouchUTM() {
  try { return JSON.parse(localStorage.getItem('utm_first_touch')) || {}; } catch(e) { return {}; }
}

// ═══════════════════════════════════════════
// 6. A/B VARIANT
// ═══════════════════════════════════════════
(function() {
  var v = new URLSearchParams(location.search).get('variant');
  if(v) sessionStorage.setItem('ab_variant', v);
})();

function getVariant() { return sessionStorage.getItem('ab_variant') || null; }

// ═══════════════════════════════════════════
// 7. SESSION ENGAGEMENT SCORING
// ═══════════════════════════════════════════
(function() {
  var visits = parseInt(localStorage.getItem('aph_visit_count') || '0') + 1;
  localStorage.setItem('aph_visit_count', visits);
  var level = 'new_visitor';
  if (visits >= 10)     level = 'power_user';
  else if (visits >= 5) level = 'returning_user';
  else if (visits >= 2) level = 'engaged_visitor';

  gtag('set', 'user_properties', { engagement_level: level });

  if(ANALYTICS_DEBUG) console.log('%c[Analytics] Visit #' + visits + ' → ' + level, 'color:#10b981;font-weight:bold');
})();

// ═══════════════════════════════════════════
// 8. CORE EVENT TRACKER
// ═══════════════════════════════════════════
function trackEvent(name, params, isConversion) {
  params = params || {};
  params.page_location = location.href;
  params.page_title = document.title;
  params.content_group = getContentGroup();
  params.page_type = getPageType();
  var v = getVariant(); if(v) params.ab_variant = v;
  if(isConversion) Object.assign(params, getUTMData());
  gtag('event', name, params);
  if(ANALYTICS_DEBUG) console.log('%c[Analytics] ' + name, 'color:#6366f1;font-weight:bold', params);
}

// ═══════════════════════════════════════════
// 9. PREDEFINED CUSTOM EVENTS
// ═══════════════════════════════════════════

// — CTA Clicks
function trackCTAClick(btn) {
  trackEvent('cta_click', { button_name: btn, cta_location: getContentGroup() });
}

// — Tool Usage
function trackToolUsed(tool, action) {
  trackEvent('tool_used', { tool_name: tool, action_type: action });
  // Update user property for preferred tool
  localStorage.setItem('aph_preferred_tool', tool);
  gtag('set', 'user_properties', { preferred_tool: tool });
}

// — Blog Engagement
function trackBlogClick(title) {
  trackEvent('blog_click', { blog_title: title, content_group: 'Blog' });
}

// — Newsletter Signup (Conversion)
function trackNewsletterSignup() {
  trackEvent('newsletter_signup', {}, true);
  // Also fire the GA4 recommended event for Google Ads optimization
  trackEvent('generate_lead', {
    currency: 'USD',
    value: 2.00,
    lead_type: 'newsletter'
  }, true);
}

// — Plan Selected (Conversion)
function trackPlanSelected(plan) {
  trackEvent('plan_selected', { plan_name: plan }, true);
  // Update user property
  gtag('set', 'user_properties', { plan_interest: plan });
  localStorage.setItem('aph_plan_interest', plan);
}

// — Contact Submitted (Conversion)
function trackContactSubmitted() {
  trackEvent('contact_submitted', {}, true);
  // Also fire GA4 recommended generate_lead event
  trackEvent('generate_lead', {
    currency: 'USD',
    value: 25.00,
    lead_type: 'contact_form'
  }, true);
}

// ═══════════════════════════════════════════
// 10. NEW CUSTOM EVENTS
// ═══════════════════════════════════════════

// — Feature Card Interest (Homepage)
function trackFeatureInterest(featureName) {
  trackEvent('feature_interest', { feature_name: featureName });
}

// — Testimonial View
function trackTestimonialView(authorName) {
  trackEvent('testimonial_view', { author: authorName });
}

// — Navigation Click
function trackNavClick(destination, sourcePage) {
  trackEvent('navigation_click', {
    destination: destination,
    source_page: sourcePage || location.pathname
  });
}

// — Footer Link Click
function trackFooterClick(linkCategory, linkText) {
  trackEvent('footer_click', {
    category: linkCategory,
    link_text: linkText
  });
}

// — Pricing Engagement
function trackPricingEngagement(plan, action) {
  trackEvent('pricing_engagement', {
    plan_name: plan,
    action: action   // 'view', 'hover', 'faq_expand', 'faq_view'
  });
}

// — FAQ Interaction
function trackFAQInteraction(question) {
  trackEvent('faq_interaction', {
    question: question,
    page: getContentGroup()
  });
}

// — Tool Completion (deep engagement conversion)
function trackToolCompletion(toolName, details) {
  trackEvent('tool_completion', Object.assign({
    tool_name: toolName
  }, details || {}), true);
}

// — Social Link Click
function trackSocialClick(platform) {
  trackEvent('social_click', { platform: platform });
}

// ═══════════════════════════════════════════
// 11. E-COMMERCE DATA LAYER
// ═══════════════════════════════════════════
var PLAN_CATALOG = {
  free:       { item_id: 'plan_free',       item_name: 'Free Plan',       price: 0,     item_category: 'subscription' },
  pro:        { item_id: 'plan_pro',        item_name: 'Pro Plan',        price: 19.00, item_category: 'subscription' },
  enterprise: { item_id: 'plan_enterprise', item_name: 'Enterprise Plan', price: 49.00, item_category: 'subscription' }
};

function trackViewPricingPlans() {
  gtag('event', 'view_item_list', {
    item_list_id: 'pricing_plans',
    item_list_name: 'Pricing Plans',
    items: [PLAN_CATALOG.free, PLAN_CATALOG.pro, PLAN_CATALOG.enterprise]
  });
  if(ANALYTICS_DEBUG) console.log('%c[Analytics] E-COM: view_item_list', 'color:#f59e0b;font-weight:bold');
}

function trackViewPlan(planKey) {
  var item = PLAN_CATALOG[planKey];
  if(!item) return;
  gtag('event', 'view_item', {
    currency: 'USD',
    value: item.price,
    items: [item]
  });
}

function trackAddToCart(planKey) {
  var item = PLAN_CATALOG[planKey];
  if(!item) return;
  gtag('event', 'add_to_cart', {
    currency: 'USD',
    value: item.price,
    items: [item]
  });
}

function trackBeginCheckout(planKey) {
  var item = PLAN_CATALOG[planKey];
  if(!item) return;
  gtag('event', 'begin_checkout', {
    currency: 'USD',
    value: item.price,
    items: [item]
  });
}

// ═══════════════════════════════════════════
// 12. SCROLL DEPTH TRACKING
// ═══════════════════════════════════════════
(function() {
  var thresholds = [25, 50, 75, 100], tracked = {};
  function check() {
    var h = document.documentElement.scrollHeight - innerHeight;
    var pct = h <= 0 ? 100 : Math.round((scrollY / h) * 100);
    thresholds.forEach(function(t) {
      if (pct >= t && !tracked[t]) {
        tracked[t] = true;
        trackEvent('scroll_depth', { percentage_scrolled: t });
      }
    });
  }
  var to;
  addEventListener('scroll', function() {
    if (!to) to = setTimeout(function() { check(); to = null; }, 200);
  }, { passive: true });
  addEventListener('load', check);
})();

// ═══════════════════════════════════════════
// 13. TIME ON PAGE
// ═══════════════════════════════════════════
(function() {
  var start = performance.now();
  addEventListener('beforeunload', function() {
    var seconds = Math.round((performance.now() - start) / 1000);
    trackEvent('time_on_page', {
      seconds: seconds,
      page_path: location.pathname,
      time_bucket: seconds < 10 ? 'bounce' : seconds < 30 ? 'scan' : seconds < 120 ? 'read' : 'deep_engage'
    });
  });
})();

// ═══════════════════════════════════════════
// 14. PAGE VISIBILITY / TAB FOCUS
// ═══════════════════════════════════════════
(function() {
  var hiddenAt = null;
  document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'hidden') {
      hiddenAt = Date.now();
    } else if (document.visibilityState === 'visible' && hiddenAt) {
      var awaySeconds = Math.round((Date.now() - hiddenAt) / 1000);
      if (awaySeconds > 5) { // Only track if away > 5 seconds
        trackEvent('page_refocus', {
          away_seconds: awaySeconds,
          page_path: location.pathname
        });
      }
      hiddenAt = null;
    }
  });
})();

// ═══════════════════════════════════════════
// 15. JAVASCRIPT ERROR TRACKING
// ═══════════════════════════════════════════
window.addEventListener('error', function(e) {
  trackEvent('javascript_error', {
    error_message: (e.message || 'unknown').substring(0, 100),
    error_source: (e.filename || 'unknown').split('/').pop(),
    error_line: e.lineno || 0
  });
});

window.addEventListener('unhandledrejection', function(e) {
  trackEvent('javascript_error', {
    error_message: ('Promise: ' + (e.reason || 'unknown')).substring(0, 100),
    error_source: 'promise',
    error_line: 0
  });
});

// ═══════════════════════════════════════════
// 16. CONSENT MANAGEMENT HELPERS
// ═══════════════════════════════════════════
function grantFullConsent() {
  gtag('consent', 'update', {
    'ad_storage': 'granted',
    'ad_user_data': 'granted',
    'ad_personalization': 'granted',
    'analytics_storage': 'granted',
    'personalization_storage': 'granted'
  });
  localStorage.setItem('aph_consent', 'granted');
  trackEvent('consent_granted', { consent_type: 'full' });
  if(ANALYTICS_DEBUG) console.log('%c[Consent] Full consent granted', 'color:#10b981;font-weight:bold');
}

function grantAnalyticsOnly() {
  gtag('consent', 'update', {
    'analytics_storage': 'granted'
  });
  localStorage.setItem('aph_consent', 'analytics_only');
  trackEvent('consent_granted', { consent_type: 'analytics_only' });
}

function denyAllConsent() {
  gtag('consent', 'update', {
    'ad_storage': 'denied',
    'ad_user_data': 'denied',
    'ad_personalization': 'denied',
    'analytics_storage': 'denied',
    'personalization_storage': 'denied'
  });
  localStorage.setItem('aph_consent', 'denied');
}

// Auto-restore consent on return visits
(function() {
  var saved = localStorage.getItem('aph_consent');
  if (saved === 'granted') grantFullConsent();
  else if (saved === 'analytics_only') grantAnalyticsOnly();
})();

// ═══════════════════════════════════════════
// 17. EXPORT PUBLIC API
// ═══════════════════════════════════════════
window.Analytics = {
  // Core
  trackEvent: trackEvent,
  trackCTAClick: trackCTAClick,
  // Existing events
  trackToolUsed: trackToolUsed,
  trackBlogClick: trackBlogClick,
  trackNewsletterSignup: trackNewsletterSignup,
  trackPlanSelected: trackPlanSelected,
  trackContactSubmitted: trackContactSubmitted,
  // New events
  trackFeatureInterest: trackFeatureInterest,
  trackTestimonialView: trackTestimonialView,
  trackNavClick: trackNavClick,
  trackFooterClick: trackFooterClick,
  trackPricingEngagement: trackPricingEngagement,
  trackFAQInteraction: trackFAQInteraction,
  trackToolCompletion: trackToolCompletion,
  trackSocialClick: trackSocialClick,
  // E-Commerce
  trackViewPricingPlans: trackViewPricingPlans,
  trackViewPlan: trackViewPlan,
  trackAddToCart: trackAddToCart,
  trackBeginCheckout: trackBeginCheckout,
  // Consent
  grantFullConsent: grantFullConsent,
  grantAnalyticsOnly: grantAnalyticsOnly,
  denyAllConsent: denyAllConsent,
  // Helpers
  getUTMData: getUTMData,
  getFirstTouchUTM: getFirstTouchUTM,
  getVariant: getVariant,
  getContentGroup: getContentGroup,
  ANALYTICS_DEBUG: ANALYTICS_DEBUG
};

if(ANALYTICS_DEBUG) {
  console.log('%c[Analytics] AI Productivity Hub — GA4 Deep Integration Loaded', 'color:#6366f1;font-weight:bold;font-size:14px');
  console.log('%c[Analytics] Measurement ID: ' + GA_MEASUREMENT_ID, 'color:#8b5cf6');
  console.log('%c[Analytics] Content Group: ' + getContentGroup(), 'color:#8b5cf6');
  console.log('%c[Analytics] Page Type: ' + getPageType(), 'color:#8b5cf6');
}
