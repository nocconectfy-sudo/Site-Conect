// Projeto por João Alberto Oliveira
// ============================================
// CONECTFY — Interactions & Animations
// ============================================

(() => {
    'use strict';

    // ---- Navbar scroll state ----
    const navbar = document.getElementById('navbar');
    const onScroll = () => {
        if (window.scrollY > 20) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // ---- Mobile menu toggle ----
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
        });
        navLinks.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => navLinks.classList.remove('open'));
        });
    }

    // ---- Footer year ----
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // ---- Hero slider ----
    const slider = document.getElementById('heroSlider');
    if (slider) {
        const slides = slider.querySelectorAll('.slide');
        const dots = slider.querySelectorAll('.dot');
        const bar = document.getElementById('spBar');
        const prev = slider.querySelector('.slider-prev');
        const next = slider.querySelector('.slider-next');
        const INTERVAL = 5000;
        let current = 0;
        let timer = null;

        const goTo = (idx) => {
            current = (idx + slides.length) % slides.length;
            slides.forEach((s, i) => s.classList.toggle('is-active', i === current));
            dots.forEach((d, i) => d.classList.toggle('is-active', i === current));
            restartBar();
        };

        const restartBar = () => {
            if (!bar) return;
            bar.classList.remove('running');
            void bar.offsetWidth;
            bar.classList.add('running');
        };

        const play = () => {
            stop();
            restartBar();
            timer = setInterval(() => goTo(current + 1), INTERVAL);
        };

        const stop = () => {
            if (timer) { clearInterval(timer); timer = null; }
        };

        dots.forEach(d => d.addEventListener('click', () => {
            goTo(parseInt(d.dataset.index, 10));
            play();
        }));

        if (prev) prev.addEventListener('click', () => { goTo(current - 1); play(); });
        if (next) next.addEventListener('click', () => { goTo(current + 1); play(); });

        slider.addEventListener('mouseenter', stop);
        slider.addEventListener('mouseleave', play);

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) stop(); else play();
        });

        play();
    }

    // ---- Reveal on scroll ----
    const revealTargets = document.querySelectorAll('.plan-card, .benefit-card, .section-head, .cta-card');
    revealTargets.forEach(el => el.classList.add('reveal'));

    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('active'), i * 60);
                revealObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealTargets.forEach(el => revealObs.observe(el));

    // ---- Plan card tilt (subtle parallax) ----
    const planCards = document.querySelectorAll('.plan-card');
    planCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = `translateY(-8px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
            const shine = card.querySelector('.plan-shine');
            if (shine) {
                shine.style.background = `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(247, 37, 133, 0.22) 0%, transparent 50%)`;
            }
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            const shine = card.querySelector('.plan-shine');
            if (shine) shine.style.background = '';
        });
    });

    // ---- Smooth anchor scroll (offset for fixed nav) ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href.length < 2) return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            const top = target.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });

    // ---- Parallax blobs on mouse move (desktop only) ----
    if (window.matchMedia('(pointer: fine)').matches) {
        const blobs = document.querySelectorAll('.blob');
        let rafId = null;
        document.addEventListener('mousemove', (e) => {
            if (rafId) return;
            rafId = requestAnimationFrame(() => {
                const x = (e.clientX / window.innerWidth - 0.5) * 30;
                const y = (e.clientY / window.innerHeight - 0.5) * 30;
                blobs.forEach((b, i) => {
                    const f = (i + 1) * 0.4;
                    b.style.translate = `${x * f}px ${y * f}px`;
                });
                rafId = null;
            });
        });
    }
})();

// Projeto por João Alberto Oliveira
