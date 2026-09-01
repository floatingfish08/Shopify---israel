(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const revealGroups = [
    { selector: '.nova-marketplace__grid', effect: 'scale' },
    { selector: '.nova-trust__item', effect: 'rise' },
    { selector: '.nova-commerce__heading', effect: 'left' },
    { selector: '.nova-category-card', effect: 'scale' },
    { selector: '.nova-featured__heading', effect: 'right' },
    { selector: '.nova-product-card', effect: 'rise' },
    { selector: '.nova-shop__heading', effect: 'left' },
    { selector: '.nova-shop-card', effect: 'rise' },
    { selector: '.nova-shop__shipping span', effect: 'rise' },
    { selector: '.nova-regulatory__header > *', effect: 'left' },
    { selector: '.nova-regulatory__feature', effect: 'scale' },
    { selector: '.nova-regulatory__cards article', effect: 'right' },
    { selector: '.nova-section-heading > *', effect: 'left' },
    { selector: '.nova-solution-card', effect: 'scale' },
    { selector: '.nova-system-card', effect: 'scale' },
    { selector: '.nova-catalog-map', effect: 'rise' },
    { selector: '.nova-quality__intro', effect: 'left' },
    { selector: '.nova-quality__steps li', effect: 'right' },
    { selector: '.nova-quality__certificate', effect: 'scale' },
    { selector: '.nova-resources__intro', effect: 'left' },
    { selector: '.nova-resources__links a', effect: 'right' },
    { selector: '.nova-resources__support', effect: 'scale' },
    { selector: '.nova-footer-hero > *', effect: 'rise' },
    { selector: '.footer__blocks-wrapper > *', effect: 'rise' },
    { selector: '.footer-block--newsletter', effect: 'right' },
    { selector: '.nova-collection-hero__inner > *', effect: 'rise' },
    { selector: '.nova-directory__hero-grid > *', effect: 'rise' },
    { selector: '.nova-directory__group-heading', effect: 'left' },
    { selector: '.nova-directory__card', effect: 'rise' },
    { selector: '.nova-directory__footer > *', effect: 'rise' },
    { selector: "main[data-template='collection'] .product-grid > .grid__item", effect: 'rise' },
    { selector: "main[data-template='product'] .product__media-wrapper", effect: 'left' },
    { selector: "main[data-template='product'] .product__info-wrapper", effect: 'right' },
  ];

  const revealImmediately = (elements) => {
    elements.forEach((element) => element.classList.add('is-visible'));
  };

  const prepareGroup = (selector, effect = 'rise') => {
    const elements = Array.from(document.querySelectorAll(selector));

    elements.forEach((element, index) => {
      if (element.dataset.novaMotionReady === 'true') return;

      element.dataset.novaMotionReady = 'true';
      element.classList.add('nova-reveal', `nova-reveal--${effect}`);
      element.style.setProperty('--nova-reveal-order', String(index % 6));
    });

    return elements;
  };

  const init = () => {
    const elements = revealGroups.flatMap((group) => prepareGroup(group.selector, group.effect));

    if (reducedMotion.matches || !('IntersectionObserver' in window)) {
      revealImmediately(elements);
      return;
    }

    document.documentElement.classList.add('nova-motion-ready');

    const animateCounters = (container) => {
      const counters = [
        ...(container.matches?.('[data-nova-count]') ? [container] : []),
        ...container.querySelectorAll('[data-nova-count]'),
      ];

      counters.forEach((counter) => {
        if (counter.dataset.novaCounted === 'true') return;
        counter.dataset.novaCounted = 'true';
        const end = Number(counter.dataset.novaCount);
        const startTime = performance.now();

        const tick = (now) => {
          const progress = Math.min((now - startTime) / 950, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          counter.textContent = String(Math.round(end * eased));
          if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add('is-visible');
          animateCounters(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -7% 0px', threshold: 0.08 },
    );

    elements.forEach((element) => observer.observe(element));

    const progressBar = document.querySelector('.nova-scroll-progress');
    const depthElements = Array.from(document.querySelectorAll('[data-nova-depth]'));
    let scrollFrame = 0;

    const updateScrollEffects = () => {
      scrollFrame = 0;
      const scrollRange = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollRange > 0 ? Math.min(window.scrollY / scrollRange, 1) : 0;
      if (progressBar) progressBar.style.transform = `scaleX(${progress})`;

      depthElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        if (rect.bottom < -200 || rect.top > window.innerHeight + 200) return;
        const centerOffset = (window.innerHeight / 2 - (rect.top + rect.height / 2)) / window.innerHeight;
        const offset = Math.max(-1, Math.min(1, centerOffset)) * 18;
        element.style.setProperty('--nova-depth-offset', `${offset.toFixed(2)}px`);
      });
    };

    const requestScrollUpdate = () => {
      if (scrollFrame) return;
      scrollFrame = requestAnimationFrame(updateScrollEffects);
    };

    updateScrollEffects();
    window.addEventListener('scroll', requestScrollUpdate, { passive: true });
    window.addEventListener('resize', requestScrollUpdate);

    const productGrid = document.querySelector('#ProductGridContainer');
    if (!productGrid || !('MutationObserver' in window)) return;

    new MutationObserver(() => {
      const newItems = prepareGroup("main[data-template='collection'] .product-grid > .grid__item", 'rise');
      newItems.forEach((element) => {
        if (element.classList.contains('is-visible')) return;
        observer.observe(element);
      });
    }).observe(productGrid, { childList: true, subtree: true });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
