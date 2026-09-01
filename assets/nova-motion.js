(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const revealGroups = [
    '.nova-marketplace__grid',
    '.nova-trust__item',
    '.nova-commerce__heading',
    '.nova-category-card',
    '.nova-featured__heading',
    '.nova-product-card',
    '.nova-shop__heading',
    '.nova-shop-card',
    '.nova-shop__shipping span',
    '.nova-regulatory__lead',
    '.nova-regulatory__cards article',
    '.nova-section-heading',
    '.nova-solution-card',
    '.nova-system-card',
    '.nova-catalog-map',
    '.nova-quality__intro',
    '.nova-quality__steps li',
    '.nova-resources__intro',
    '.nova-resources__links a',
    '.nova-collection-hero__inner > *',
    '.nova-directory__hero-grid > *',
    '.nova-directory__group-heading',
    '.nova-directory__card',
    '.nova-directory__footer > *',
    "main[data-template='collection'] .product-grid > .grid__item",
    "main[data-template='product'] .product__media-wrapper",
    "main[data-template='product'] .product__info-wrapper",
  ];

  const revealImmediately = (elements) => {
    elements.forEach((element) => element.classList.add('is-visible'));
  };

  const prepareGroup = (selector) => {
    const elements = Array.from(document.querySelectorAll(selector));

    elements.forEach((element, index) => {
      if (element.dataset.novaMotionReady === 'true') return;

      element.dataset.novaMotionReady = 'true';
      element.classList.add('nova-reveal');
      element.style.setProperty('--nova-reveal-order', String(index % 6));
    });

    return elements;
  };

  const init = () => {
    const elements = revealGroups.flatMap(prepareGroup);

    if (reducedMotion.matches || !('IntersectionObserver' in window)) {
      revealImmediately(elements);
      return;
    }

    document.documentElement.classList.add('nova-motion-ready');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -7% 0px', threshold: 0.08 },
    );

    elements.forEach((element) => observer.observe(element));

    const productGrid = document.querySelector('#ProductGridContainer');
    if (!productGrid || !('MutationObserver' in window)) return;

    new MutationObserver(() => {
      const newItems = prepareGroup("main[data-template='collection'] .product-grid > .grid__item");
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
