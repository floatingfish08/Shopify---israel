document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-product-tabs]').forEach((tabs) => {
    const triggers = Array.from(tabs.querySelectorAll('[data-product-tab]'));
    const panels = Array.from(tabs.querySelectorAll('[data-product-panel]'));

    const activate = (trigger) => {
      const target = trigger.dataset.productTab;
      triggers.forEach((item) => {
        const active = item === trigger;
        item.setAttribute('aria-selected', active ? 'true' : 'false');
        item.tabIndex = active ? 0 : -1;
      });
      panels.forEach((panel) => {
        panel.hidden = panel.dataset.productPanel !== target;
      });
    };

    triggers.forEach((trigger, index) => {
      trigger.addEventListener('click', () => activate(trigger));
      trigger.addEventListener('keydown', (event) => {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
        event.preventDefault();
        const direction = event.key === 'ArrowRight' ? 1 : -1;
        const next = triggers[(index + direction + triggers.length) % triggers.length];
        activate(next);
        next.focus();
      });
    });
  });
});
