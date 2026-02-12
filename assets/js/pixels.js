/**
 * Tracking Pixels & Cookie Consent
 * =================================
 * Meta Pixel + Google Analytics 4 + Google Ads
 * GDPR-compliant: pixels only load after user consent
 *
 * SETUP: Replace these placeholder IDs with your real ones:
 * 1. META_PIXEL_ID  → your Meta Pixel ID (e.g. '123456789012345')
 * 2. GA4_ID         → your GA4 Measurement ID (e.g. 'G-XXXXXXXXXX')
 * 3. GADS_ID        → your Google Ads ID (e.g. 'AW-XXXXXXXXX')
 */

const META_PIXEL_ID = '1289267666587104';
const GA4_ID = 'G-DDFNKFDZHR';
const GADS_ID = 'YOUR_GOOGLE_ADS_ID';

const CONSENT_KEY = 'cookie_consent';

// ─── Cookie Consent Banner ───────────────────────────────────────

function createConsentBanner() {
    if (localStorage.getItem(CONSENT_KEY)) return;

    const isRu = document.documentElement.lang === 'ru';

    const banner = document.createElement('div');
    banner.id = 'cookieConsent';
    banner.className = 'cookie-consent';
    banner.innerHTML = `
        <div class="cookie-consent-inner">
            <p class="cookie-consent-text">
                ${isRu
                    ? 'Мы используем файлы cookie и аналитические инструменты для улучшения работы сайта. Подробнее в нашей <a href="privacy-policy-ru.html">Политике конфиденциальности</a>.'
                    : 'We use cookies and analytics tools to improve your experience. Learn more in our <a href="privacy-policy.html">Privacy Policy</a>.'}
            </p>
            <div class="cookie-consent-buttons">
                <button class="cookie-btn cookie-btn-accept" onclick="acceptCookies()">
                    ${isRu ? 'Принять' : 'Accept'}
                </button>
                <button class="cookie-btn cookie-btn-decline" onclick="declineCookies()">
                    ${isRu ? 'Отклонить' : 'Decline'}
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(banner);
    // Trigger animation
    requestAnimationFrame(() => banner.classList.add('visible'));
}

function acceptCookies() {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    hideBanner();
    loadAllPixels();
}

function declineCookies() {
    localStorage.setItem(CONSENT_KEY, 'declined');
    hideBanner();
}

function hideBanner() {
    const banner = document.getElementById('cookieConsent');
    if (banner) {
        banner.classList.remove('visible');
        setTimeout(() => banner.remove(), 300);
    }
}

// ─── Pixel Loaders ───────────────────────────────────────────────

function loadAllPixels() {
    loadMetaPixel();
    loadGA4();
    loadGoogleAds();
}

function loadMetaPixel() {
    if (META_PIXEL_ID === 'YOUR_META_PIXEL_ID') return;

    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');

    fbq('init', META_PIXEL_ID);
    fbq('track', 'PageView');
}

function loadGA4() {
    if (GA4_ID === 'YOUR_GA4_MEASUREMENT_ID') return;

    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_ID;
    document.head.appendChild(s);

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA4_ID);
}

function loadGoogleAds() {
    if (GADS_ID === 'YOUR_GOOGLE_ADS_ID') return;

    // Google Ads uses the same gtag.js — just add the config
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    if (!window.gtag) window.gtag = gtag;
    gtag('config', GADS_ID);
}

// ─── Event Tracking Helpers ──────────────────────────────────────

/**
 * Track a registration/lead event across all pixels
 * Call this after a successful form submission
 */
function trackRegistration(data) {
    if (localStorage.getItem(CONSENT_KEY) !== 'accepted') return;

    // Meta Pixel
    if (typeof fbq === 'function') {
        fbq('track', 'Lead', {
            content_name: data.type || 'camp_registration',
            content_category: data.camp || 'padel_camp',
            value: data.value || 0,
            currency: 'EUR'
        });
    }

    // GA4
    if (typeof gtag === 'function') {
        gtag('event', 'generate_lead', {
            event_category: 'registration',
            event_label: data.type || 'camp_registration',
            value: data.value || 0,
            currency: 'EUR'
        });
    }
}

/**
 * Track a purchase/payment initiation
 */
function trackPurchase(data) {
    if (localStorage.getItem(CONSENT_KEY) !== 'accepted') return;

    if (typeof fbq === 'function') {
        fbq('track', 'InitiateCheckout', {
            content_name: data.camp || 'padel_camp',
            value: data.value || 0,
            currency: 'EUR'
        });
    }

    if (typeof gtag === 'function') {
        gtag('event', 'begin_checkout', {
            event_category: 'payment',
            event_label: data.camp || 'padel_camp',
            value: data.value || 0,
            currency: 'EUR'
        });
    }
}

/**
 * Track a contact form submission
 */
function trackContact() {
    if (localStorage.getItem(CONSENT_KEY) !== 'accepted') return;

    if (typeof fbq === 'function') {
        fbq('track', 'Contact');
    }

    if (typeof gtag === 'function') {
        gtag('event', 'contact', {
            event_category: 'engagement',
            event_label: 'contact_form'
        });
    }
}

/**
 * Track a service booking (massage, media package, etc.)
 */
function trackBooking(serviceName, value) {
    if (localStorage.getItem(CONSENT_KEY) !== 'accepted') return;

    if (typeof fbq === 'function') {
        fbq('track', 'Schedule', {
            content_name: serviceName,
            value: value || 0,
            currency: 'EUR'
        });
    }

    if (typeof gtag === 'function') {
        gtag('event', 'purchase', {
            event_category: 'booking',
            event_label: serviceName,
            value: value || 0,
            currency: 'EUR'
        });
    }
}

// ─── Initialize ──────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function() {
    var consent = localStorage.getItem(CONSENT_KEY);

    if (consent === 'accepted') {
        loadAllPixels();
    } else if (!consent) {
        createConsentBanner();
    }
    // If 'declined' — do nothing, no banner, no pixels
});
