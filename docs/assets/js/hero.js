(function () {
    const toggle = document.querySelector('.nav-toggle');
    const drawer = document.getElementById('nav-drawer');
    const collage = document.getElementById('collage-wrap');
    const zone = document.querySelector('.collage-zone');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

    const LERP = 0.035;
    const TILT = { x: 5, y: 3.5 };
    const PARALLAX = { x: 14, y: 10 };

    function initReadingProgress() {
        const progress = document.querySelector('.reading-progress');
        if (!progress) return;

        const update = () => {
            const scrollable = document.documentElement.scrollHeight - window.innerHeight;
            const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
            progress.style.setProperty('--progress', pct.toFixed(2) + '%');
        };

        update();
        window.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update);
    }

    function initMagneticActions() {
        if (reduced || typeof gsap === 'undefined') return;

        document.querySelectorAll('.hero-btn, .nav-cta, .collage-play').forEach(el => {
            el.addEventListener('mousemove', e => {
                const r = el.getBoundingClientRect();
                const x = (e.clientX - r.left) / r.width - 0.5;
                const y = (e.clientY - r.top) / r.height - 0.5;
                el.style.setProperty('--gx', (e.clientX - r.left) + 'px');
                el.style.setProperty('--gy', (e.clientY - r.top) + 'px');
                el.style.setProperty('--btn-rx', (-y * 7).toFixed(2) + 'deg');
                el.style.setProperty('--btn-ry', (x * 9).toFixed(2) + 'deg');
                gsap.to(el, { x: x * 8, y: y * 5, duration: 0.45, ease: 'power3.out', overwrite: 'auto' });
            }, { passive: true });

            el.addEventListener('mouseleave', () => {
                el.style.setProperty('--btn-rx', '0deg');
                el.style.setProperty('--btn-ry', '0deg');
                gsap.to(el, { x: 0, y: 0, duration: 0.65, ease: 'elastic.out(1, 0.45)', overwrite: 'auto' });
            });
        });
    }

    function initStatCounters() {
        const counters = document.querySelectorAll('.hero-stat-num[data-count]');
        if (!counters.length) return;

        const run = (el) => {
            const target = Number(el.dataset.count || 0);
            const pad = Number(el.dataset.pad || 0);
            const duration = 1200;
            const start = performance.now();

            const frame = (now) => {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 4);
                const value = Math.round(target * eased);
                el.textContent = pad ? String(value).padStart(pad, '0') : String(value);
                if (progress < 1) requestAnimationFrame(frame);
            };

            requestAnimationFrame(frame);
        };

        const seen = new WeakSet();
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting || seen.has(entry.target)) return;
                seen.add(entry.target);
                run(entry.target);
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.55 });

        counters.forEach(el => observer.observe(el));
    }

    function initEntrance() {
        const intro = document.querySelector('.site-intro');
        const video = intro?.querySelector('.site-intro-video');
        const isMobile = matchMedia('(max-width: 767px)').matches
            || matchMedia('(hover: none) and (pointer: coarse)').matches;
        const canAnimate = !reduced && !isMobile && typeof gsap !== 'undefined';

        let finished = false;
        let fallbackTimer;

        const unlockShell = () => {
            document.documentElement.classList.remove('intro-lock');
        };

        const revealHero = () => {
            if (finished) return;
            finished = true;
            window.clearTimeout(fallbackTimer);
            unlockShell();

            if (!canAnimate) {
                if (intro) intro.remove();
                return;
            }

            const tl = gsap.timeline({
                defaults: { ease: 'power2.out' },
                onComplete: () => {
                    if (intro) intro.remove();
                }
            });

            if (intro) {
                tl.to(intro, { autoAlpha: 0, duration: 0.55, ease: 'sine.inOut' })
                    .from('.page-shell', {
                        y: 14,
                        scale: 0.992,
                        autoAlpha: 0,
                        filter: 'blur(5px)',
                        duration: 1.05,
                        clearProps: 'all'
                    }, '-=0.12');
            }

            tl.from('.site-nav-pill', { y: -14, autoAlpha: 0, duration: 1.05 }, intro ? '-=0.3' : 0)
            .from('.hero-badge', { y: 18, autoAlpha: 0, duration: 1.05 }, '-=0.55')
            .from('.hero-title-line', { y: 34, autoAlpha: 0, duration: 1.1, stagger: 0.2 }, '-=0.65')
            .from('.hero-rule', {
                scaleX: 0,
                autoAlpha: 0,
                duration: 1.05,
                transformOrigin: 'left center'
            }, '-=0.55')
            .from('.hero-lead', { y: 24, autoAlpha: 0, duration: 1.05 }, '-=0.45')
            .from('.hero-sub', { y: 24, autoAlpha: 0, duration: 1.05, ease: 'power2.out' }, '-=0.75')
            .from('.hero-profile', { y: 18, autoAlpha: 0, duration: 1, ease: 'power2.out' }, '-=0.65')
            .from('.hero-btn', { y: 20, autoAlpha: 0, duration: 1, stagger: 0.14 }, '-=0.55')
            .from('.hero-signature > *', { y: 14, autoAlpha: 0, duration: 1, stagger: 0.12 }, '-=0.5')
            .from('.collage-arch', {
                y: 36,
                autoAlpha: 0,
                scale: 0.97,
                duration: 1.35,
                clearProps: 'transform'
            }, '-=1.05')
            .from('.collage-card-dark', {
                y: 28,
                autoAlpha: 0,
                duration: 1.2,
                clearProps: 'transform'
            }, '-=0.9')
            .from('.collage-card-ticket', {
                y: 30,
                autoAlpha: 0,
                duration: 1.2,
                ease: 'power2.out',
                clearProps: 'transform'
            }, '-=0.85')
            .from('.collage-deco', {
                scale: 0.72,
                autoAlpha: 0,
                rotation: -28,
                duration: 1.25,
                ease: 'power2.out',
                clearProps: 'transform'
            }, '-=0.95');

        };

        // Mobile: skip intro video — autoplay/codecs often leave the shell locked blank.
        if (isMobile || reduced || !video) {
            revealHero();
            return;
        }

        video.muted = true;
        video.defaultMuted = true;
        video.setAttribute('playsinline', '');
        video.playsInline = true;
        video.playbackRate = 1.12;

        const setFallback = () => {
            window.clearTimeout(fallbackTimer);
            const duration = Number.isFinite(video.duration) && video.duration > 0
                ? Math.min((video.duration / video.playbackRate + 0.8) * 1000, 4500)
                : 2500;
            fallbackTimer = window.setTimeout(revealHero, duration);
        };

        video.addEventListener('loadedmetadata', setFallback, { once: true });
        video.addEventListener('ended', revealHero, { once: true });
        video.addEventListener('error', revealHero, { once: true });
        video.addEventListener('stalled', () => window.setTimeout(revealHero, 800), { once: true });
        setFallback();
        // Absolute safety net
        window.setTimeout(revealHero, 5000);

        const playPromise = video.play();
        if (playPromise) {
            playPromise.catch(() => window.setTimeout(revealHero, 200));
        }
    }

    initReadingProgress();
    initEntrance();
    initMagneticActions();
    initStatCounters();

    if (toggle && drawer) {
        toggle.addEventListener('click', () => {
            const open = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', String(!open));
            drawer.hidden = open;
        });
    }

    document.querySelectorAll('.nav-link').forEach(link => {
        let lx = 0, ly = 0, lcx = 0, lcy = 0, lraf;
        const lerpLink = () => {
            lcx += (lx - lcx) * 0.12;
            lcy += (ly - lcy) * 0.12;
            link.style.transform = `translate(${lcx.toFixed(2)}px, ${lcy.toFixed(2)}px)`;
            if (Math.abs(lx - lcx) > 0.02 || Math.abs(ly - lcy) > 0.02) {
                lraf = requestAnimationFrame(lerpLink);
            } else {
                lraf = null;
            }
        };
        link.addEventListener('mousemove', e => {
            const r = link.getBoundingClientRect();
            lx = ((e.clientX - r.left) / r.width - 0.5) * 5;
            ly = ((e.clientY - r.top) / r.height - 0.5) * 3;
            if (!lraf) lraf = requestAnimationFrame(lerpLink);
        });
        link.addEventListener('mouseleave', () => {
            lx = ly = 0;
            if (!lraf) lraf = requestAnimationFrame(lerpLink);
        });
    });

    if (collage && zone && !reduced) {
        let tx = 0, ty = 0, cx = 0, cy = 0, px = 0, py = 0, pcx = 0, pcy = 0;
        let running = false;

        const tick = () => {
            cx += (tx - cx) * LERP;
            cy += (ty - cy) * LERP;
            px += (tx * PARALLAX.x - px) * LERP;
            py += (ty * PARALLAX.y - py) * LERP;
            pcx += (px - pcx) * LERP;
            pcy += (py - pcy) * LERP;

            collage.style.transform =
                `rotateX(${cy.toFixed(3)}deg) rotateY(${cx.toFixed(3)}deg)`;
            zone.style.setProperty('--px', pcx.toFixed(2));
            zone.style.setProperty('--py', pcy.toFixed(2));

            const moving = Math.abs(tx - cx) > 0.002 || Math.abs(ty - cy) > 0.002
                || Math.abs(px - pcx) > 0.05 || Math.abs(py - pcy) > 0.05;

            if (moving || tx !== 0 || ty !== 0) {
                requestAnimationFrame(tick);
            } else {
                running = false;
            }
        };

        const start = () => {
            if (!running) {
                running = true;
                requestAnimationFrame(tick);
            }
        };

        zone.addEventListener('mousemove', e => {
            const b = zone.getBoundingClientRect();
            tx = ((e.clientX - b.left) / b.width - 0.5) * TILT.x;
            ty = ((e.clientY - b.top) / b.height - 0.5) * -TILT.y;
            start();
        }, { passive: true });

        zone.addEventListener('mouseleave', () => {
            tx = ty = 0;
            start();
        });
    }
})();
