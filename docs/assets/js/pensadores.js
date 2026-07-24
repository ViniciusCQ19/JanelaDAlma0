(function () {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const visual = document.querySelector('.thinkers-visual');
  const frame = document.querySelector('.visual-frame');

  if (!reduced) {
    const reveal = (selector, options = {}) => {
      document.querySelectorAll(selector).forEach((element, index) => {
        element.animate(
          [
            { opacity: 0, transform: `translateY(${options.y || 18}px)`, filter: 'blur(5px)' },
            { opacity: 1, transform: 'translateY(0)', filter: 'blur(0)' }
          ],
          {
            duration: options.duration || 950,
            delay: (options.delay || 0) + index * (options.stagger || 0),
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            fill: 'both'
          }
        );
      });
    };

    reveal('.thinkers-logo, .thinkers-nav-meta, .thinkers-back', { y: -12, duration: 800, stagger: 90 });
    reveal('.thinkers-kicker', { delay: 180 });
    reveal('.thinkers-copy h1', { y: 28, delay: 270, duration: 1150 });
    reveal('.thinkers-lead', { delay: 450 });
    reveal('.era-block, .era-line', { delay: 570, stagger: 100 });
    reveal('.visual-frame', { y: 32, delay: 300, duration: 1250 });
    reveal('.visual-note', { y: 16, delay: 790, stagger: 140 });

    if (visual && frame) {
      let targetX = 0;
      let targetY = 0;
      let currentX = 0;
      let currentY = 0;
      let running = false;

      const render = () => {
        currentX += (targetX - currentX) * 0.08;
        currentY += (targetY - currentY) * 0.08;
        frame.style.transform = `rotateX(${currentY.toFixed(2)}deg) rotateY(${currentX.toFixed(2)}deg)`;

        if (Math.abs(targetX - currentX) > 0.01 || Math.abs(targetY - currentY) > 0.01) {
          requestAnimationFrame(render);
        } else {
          running = false;
        }
      };

      const start = () => {
        if (running) return;
        running = true;
        requestAnimationFrame(render);
      };

      visual.addEventListener('mousemove', event => {
        const bounds = visual.getBoundingClientRect();
        targetX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 4.5;
        targetY = ((event.clientY - bounds.top) / bounds.height - 0.5) * -3.5;
        start();
      }, { passive: true });

      visual.addEventListener('mouseleave', () => {
        targetX = 0;
        targetY = 0;
        start();
      });
    }

    const galleryItems = document.querySelectorAll('.thinkers-reveal');
    if (galleryItems.length) {
      const seen = new WeakSet();
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting || seen.has(entry.target)) return;
          seen.add(entry.target);
          observer.unobserve(entry.target);

          const delay = Number(entry.target.dataset.delay || 0) * 1000;
          entry.target.animate(
            [
              { opacity: 0, transform: 'translateY(34px)', filter: 'blur(5px)' },
              { opacity: 1, transform: 'translateY(0)', filter: 'blur(0)' }
            ],
            {
              duration: 900,
              delay,
              easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
              fill: 'both'
            }
          );
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

      galleryItems.forEach(item => observer.observe(item));
    }

    document.querySelectorAll('.thinker-card').forEach(card => {
      card.addEventListener('mousemove', event => {
        const bounds = card.getBoundingClientRect();
        card.style.setProperty('--card-x', `${event.clientX - bounds.left}px`);
        card.style.setProperty('--card-y', `${event.clientY - bounds.top}px`);
      }, { passive: true });
    });
  }
})();
