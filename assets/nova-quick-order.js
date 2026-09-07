(() => {
  const formatMoney = (cents, currency) => new Intl.NumberFormat(document.documentElement.lang || 'en-US', { style: 'currency', currency }).format(cents / 100);

  const init = (root) => {
    if (!root || root.dataset.quickReady === 'true') return;
    root.dataset.quickReady = 'true';
    const rows = [...root.querySelectorAll('[data-quick-row]')];
    const search = root.querySelector('[data-quick-search]');
    const type = root.querySelector('[data-quick-type]');
    const visible = root.querySelector('[data-quick-visible]');
    const empty = root.querySelector('[data-quick-empty]');
    const count = root.querySelector('[data-quick-count]');
    const total = root.querySelector('[data-quick-total]');
    const status = root.querySelector('[data-quick-status]');
    const addAll = root.querySelector('[data-quick-add-all]');
    const currency = window.Shopify?.currency?.active || 'USD';

    const selectedOption = (row) => row.querySelector('[data-quick-variant]')?.selectedOptions[0];
    const updateSummary = () => {
      let itemCount = 0; let amount = 0;
      rows.forEach((row) => {
        const quantity = Math.max(0, Number(row.querySelector('[data-quick-quantity]').value) || 0);
        const price = Number(selectedOption(row)?.dataset.price) || 0;
        itemCount += quantity; amount += quantity * price;
      });
      count.textContent = itemCount; total.textContent = formatMoney(amount, currency); addAll.disabled = itemCount === 0;
    };
    const filter = () => {
      const term = search.value.trim().toLowerCase(); const wantedType = type.value; let shown = 0;
      rows.forEach((row) => { const matches = (!term || row.dataset.search.includes(term)) && (!wantedType || row.dataset.type === wantedType); row.hidden = !matches; if (matches) shown += 1; });
      visible.textContent = shown; empty.hidden = shown !== 0;
    };
    const addItems = async (items, message) => {
      if (!items.length) return;
      status.textContent = 'Adding items…';
      try {
        const response = await fetch(`${window.Shopify?.routes?.root || '/'}cart/add.js`, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ items }) });
        if (!response.ok) throw new Error((await response.json()).description || 'Could not add the selected items.');
        status.textContent = message;
        document.dispatchEvent(new CustomEvent('cart:refresh'));
      } catch (error) { status.textContent = error.message; }
    };

    rows.forEach((row) => {
      const variant = row.querySelector('[data-quick-variant]'); const quantity = row.querySelector('[data-quick-quantity]'); const add = row.querySelector('[data-quick-add]');
      const refreshVariant = () => {
        const option = selectedOption(row); const available = option?.dataset.available === 'true';
        row.querySelector('[data-quick-price]').textContent = formatMoney(Number(option?.dataset.price) || 0, currency);
        row.querySelector('[data-quick-sku]').textContent = option?.dataset.sku || '—';
        row.querySelector('[data-quick-availability]').innerHTML = available ? '<i></i> In stock' : 'Sold out'; add.disabled = !available; updateSummary();
      };
      variant?.addEventListener('change', refreshVariant);
      quantity.addEventListener('input', updateSummary);
      row.querySelector('[data-quick-minus]').addEventListener('click', () => { quantity.value = Math.max(0, Number(quantity.value || 0) - 1); updateSummary(); });
      row.querySelector('[data-quick-plus]').addEventListener('click', () => { quantity.value = Math.min(999, Number(quantity.value || 0) + 1); updateSummary(); });
      add.addEventListener('click', async () => { const qty = Math.max(1, Number(quantity.value) || 1); quantity.value = qty; await addItems([{ id: Number(variant.value), quantity: qty }], `${qty} item${qty === 1 ? '' : 's'} added to cart.`); updateSummary(); });
      refreshVariant();
    });
    search?.addEventListener('input', filter); type?.addEventListener('change', filter);
    addAll?.addEventListener('click', async () => {
      const items = rows.filter((row) => selectedOption(row)?.dataset.available === 'true').map((row) => ({ id: Number(row.querySelector('[data-quick-variant]').value), quantity: Math.max(0, Number(row.querySelector('[data-quick-quantity]').value) || 0) })).filter((item) => item.quantity > 0);
      addAll.disabled = true; await addItems(items, 'Complete quick order added to cart.'); addAll.disabled = false;
    });
    filter(); updateSummary();
  };
  document.querySelectorAll('[data-nova-quick-order]').forEach(init);
  document.addEventListener('shopify:section:load', (event) => init(event.target.querySelector('[data-nova-quick-order]')));
})();
