/* ============================================================
   JAR • IT — main.js
   ============================================================ */

'use strict';

/* ─── Scroll-triggered nav ─── */
const header = document.querySelector('.site-header');
if (header) {
    const onScroll = () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

/* ─── Active nav link ─── */
const navLinks = document.querySelectorAll('.nav__link');
const currentPath = window.location.pathname.split('/').pop() || 'index.html';
navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
        link.classList.add('active');
    }
});

/* ─── Mobile menu ─── */
const toggle   = document.querySelector('.nav__toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const closeBtn  = document.querySelector('.mobile-menu__close');

if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
        mobileMenu.classList.add('open');
        document.body.style.overflow = 'hidden';
    });
    if (closeBtn) {
        closeBtn.addEventListener('click', closeMobileMenu);
    }
    mobileMenu.querySelectorAll('.mobile-menu__link').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
}

function closeMobileMenu() {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
}

/* ─── Scroll reveal ─── */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ─── Progress bars (dashboard mockup) ─── */
const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.db-progress-fill').forEach(bar => {
                const width = bar.dataset.width;
                if (width) {
                    requestAnimationFrame(() => {
                        bar.style.width = width;
                    });
                }
            });
            progressObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.dashboard-mockup').forEach(el => progressObserver.observe(el));

/* ─── Counter animation ─── */
function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();
    const initial = 0;

    const step = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(initial + eased * (target - initial));
        el.textContent = current + suffix;
        if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

/* ─── Cookie Banner ─── */
const cookieBanner  = document.querySelector('.cookie-banner');
const acceptAll     = document.querySelector('#cookie-accept-all');
const acceptMin     = document.querySelector('#cookie-accept-min');
const cookieVersion = 'jar-it-cookies-v1';

if (cookieBanner) {
    if (!localStorage.getItem(cookieVersion)) {
        setTimeout(() => cookieBanner.classList.remove('hidden'), 1200);
    } else {
        cookieBanner.remove();
    }

    if (acceptAll) {
        acceptAll.addEventListener('click', () => {
            localStorage.setItem(cookieVersion, 'all');
            hideCookieBanner();
        });
    }

    if (acceptMin) {
        acceptMin.addEventListener('click', () => {
            localStorage.setItem(cookieVersion, 'minimal');
            hideCookieBanner();
        });
    }
}

function hideCookieBanner() {
    if (cookieBanner) {
        cookieBanner.classList.add('hidden');
        setTimeout(() => cookieBanner.remove(), 500);
    }
}

/* ─── Contact Form ─── */
const contactForm = document.querySelector('#contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const gdprCheck = contactForm.querySelector('#gdpr-consent');
        if (gdprCheck && !gdprCheck.checked) {
            alert('Gelieve akkoord te gaan met onze privacyverklaring.');
            return;
        }
        const submitBtn = contactForm.querySelector('[type="submit"]');
        submitBtn.textContent = 'Verzenden...';
        submitBtn.disabled = true;

        // Simulate async submission
        setTimeout(() => {
            const success = document.querySelector('.form-success');
            if (success) success.classList.add('show');
            contactForm.reset();
            submitBtn.textContent = 'Verzonden ✓';
            setTimeout(() => {
                submitBtn.textContent = 'Verstuur bericht';
                submitBtn.disabled = false;
            }, 4000);
        }, 1200);
    });
}

/* ─── Smooth anchor scroll ─── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const id = anchor.getAttribute('href').slice(1);
        const target = document.getElementById(id);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

/* ─── Typed text effect (hero only) ─── */
const typedEl = document.querySelector('.typed-text');
if (typedEl) {
    const words = ['KMO\'s', 'start-ups', 'kmo\'s', 'groeiende bedrijven'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const word = words[wordIndex];
        if (isDeleting) {
            typedEl.textContent = word.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedEl.textContent = word.substring(0, charIndex + 1);
            charIndex++;
        }

        let delay = isDeleting ? 60 : 100;

        if (!isDeleting && charIndex === word.length) {
            delay = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            delay = 400;
        }

        setTimeout(type, delay);
    }

    setTimeout(type, 1000);
}

/* ─── Chart bar animation (hero card) ─── */
const chartBars = document.querySelectorAll('.chart-bar');
if (chartBars.length) {
    const heights = [40, 65, 45, 80, 55, 90, 70];
    chartBars.forEach((bar, i) => {
        bar.style.height = '10%';
        setTimeout(() => {
            bar.style.transition = `height 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${i * 80}ms`;
            bar.style.height = heights[i] + '%';
        }, 600);
    });
}

/* ─── Tooltip on hover for stats ─── */
document.querySelectorAll('.hero__stat-value').forEach(el => {
    el.style.cursor = 'default';
});