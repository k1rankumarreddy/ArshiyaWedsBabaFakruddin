(() => {
  const body = document.body;
  const loader = document.querySelector('.loader');
  const progress = document.querySelector('.progress span');
  const nav = document.querySelector('.nav');
  const glow = document.querySelector('.cursor-glow');

  window.addEventListener('load', () => {
    setTimeout(() => loader?.classList.add('done'), 900);
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {threshold: 0.14, rootMargin: '0px 0px -8% 0px'});

  document.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i % 6, 5) * 70}ms`;
    observer.observe(el);
  });

  const parallaxEls = document.querySelectorAll('[data-parallax]');
  let ticking = false;

  function onScroll() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${max > 0 ? (y / max) * 100 : 0}%`;
    nav.classList.toggle('scrolled', y > 30);

    if (!ticking) {
      requestAnimationFrame(() => {
        parallaxEls.forEach(el => {
          const speed = parseFloat(el.dataset.parallax || 0);
          el.style.transform = `translate3d(0, ${y * speed}px, 0) scale(1.05)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  if (glow && matchMedia('(pointer:fine)').matches) {
    window.addEventListener('pointermove', e => {
      glow.animate(
        {left: `${e.clientX}px`, top: `${e.clientY}px`},
        {duration: 450, fill: 'forwards', easing: 'cubic-bezier(.22,1,.36,1)'}
      );
    });
  }

  document.querySelectorAll('[data-tilt]').forEach(card => {
    if (!matchMedia('(pointer:fine)').matches) return;
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      card.style.transform = `perspective(1200px) rotateX(${(-y * 3.5).toFixed(2)}deg) rotateY(${(x * 4.5).toFixed(2)}deg) translateY(-4px)`;
    });
    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({behavior:'smooth', block:'start'});
    });
  });

  // Deliberately no audio/music is included.
})();
