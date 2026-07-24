(function () {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

    function initGlowCards() {
        document.querySelectorAll('.fold-card, .fold-deep-btn, .creator-card').forEach(el => {
            el.addEventListener('mousemove', e => {
                const r = el.getBoundingClientRect();
                el.style.setProperty('--gx', (e.clientX - r.left) + 'px');
                el.style.setProperty('--gy', (e.clientY - r.top) + 'px');

                if (el.classList.contains('fold-deep-btn') && !reduced) {
                    const bx = (e.clientX - r.left) / r.width - 0.5;
                    const by = (e.clientY - r.top) / r.height - 0.5;
                    el.style.setProperty('--btn-rx', (-by * 7).toFixed(2) + 'deg');
                    el.style.setProperty('--btn-ry', (bx * 9).toFixed(2) + 'deg');
                    return;
                }

                if (!el.classList.contains('fold-card') || reduced) return;

                const mx = (e.clientX - r.left) / r.width - 0.5;
                const my = (e.clientY - r.top) / r.height - 0.5;
                el.style.setProperty('--rx', (-my * 4).toFixed(2) + 'deg');
                el.style.setProperty('--ry', (mx * 5).toFixed(2) + 'deg');
                el.style.setProperty('--ix', (-mx * 8).toFixed(2));
                el.style.setProperty('--iy', (-my * 6).toFixed(2));
            }, { passive: true });

            el.addEventListener('mouseenter', () => {
                if (el.classList.contains('fold-card')) el.classList.add('is-drifting');
            });

            el.addEventListener('mouseleave', () => {
                if (el.classList.contains('fold-deep-btn')) {
                    el.style.setProperty('--btn-rx', '0deg');
                    el.style.setProperty('--btn-ry', '0deg');
                    return;
                }

                if (!el.classList.contains('fold-card')) return;
                el.classList.remove('is-drifting');
                el.style.setProperty('--rx', '0deg');
                el.style.setProperty('--ry', '0deg');
                el.style.setProperty('--ix', '0');
                el.style.setProperty('--iy', '0');
            });
        });
    }

    function initScrollReveal() {
        if (reduced || typeof gsap === 'undefined') return;

        const items = document.querySelectorAll('.fold-reveal');
        if (!items.length) return;

        const seen = new WeakSet();

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting || seen.has(entry.target)) return;
                seen.add(entry.target);

                const delay = parseFloat(entry.target.dataset.foldDelay || 0);

                gsap.from(entry.target, {
                    y: 36,
                    autoAlpha: 0,
                    duration: 0.9,
                    delay,
                    ease: 'power3.out',
                    clearProps: 'transform'
                });
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

        items.forEach(el => observer.observe(el));
    }

    initGlowCards();
    initScrollReveal();
})();
