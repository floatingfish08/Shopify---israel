(() => {
  const formatMoney = (cents, currency) => new Intl.NumberFormat(document.documentElement.lang || 'en-US', { style: 'currency', currency }).format(cents / 100);

  const loadRemainingProducts = async (root) => {
    let next = root.querySelector('[data-quick-next-page]');
    while (next) {
      try {
        const url = new URL(next.href, window.location.origin);
        const sectionId = root.closest('.shopify-section')?.id.replace('shopify-section-', '');
        if (sectionId) url.searchParams.set('section_id', sectionId);
        const response = await fetch(url);
        if (!response.ok) break;
        const doc = new DOMParser().parseFromString(await response.text(), 'text/html');
        doc.querySelectorAll('[data-quick-row]').forEach((row) => root.querySelector('[data-quick-list]').append(row));
        next.remove();
        next = doc.querySelector('[data-quick-next-page]');
      } catch (_error) { break; }
    }
  };

  const init = async (root) => {
    if (!root || root.dataset.quickReady === 'true') return;
    root.dataset.quickReady = 'true';
    const status = root.querySelector('[data-quick-status]');
    if (root.querySelector('[data-quick-next-page]')) status.textContent = 'Loading complete catalog…';
    await loadRemainingProducts(root);

    const rows = [...root.querySelectorAll('[data-quick-row]')];
    const search = root.querySelector('[data-quick-search]');
    const clear = root.querySelector('[data-quick-clear]');
    const visible = root.querySelector('[data-quick-visible]');
    const productTotal = root.querySelector('[data-quick-total-products]');
    const empty = root.querySelector('[data-quick-empty]');
    const count = root.querySelector('[data-quick-count]');
    const total = root.querySelector('[data-quick-total]');
    const summaryEmpty = root.querySelector('[data-quick-summary-empty]');
    const summaryLines = root.querySelector('[data-quick-summary-lines]');
    const addAll = root.querySelector('[data-quick-add-all]');
    const currency = window.Shopify?.currency?.active || 'USD';
    const filters = { connection: '', type: '' };
    productTotal.textContent = rows.length;
    status.textContent = '';

    const selectedOption = (row) => row.querySelector('[data-quick-variant]')?.selectedOptions[0];
    const escapeHtml = (value) => { const node = document.createElement('div'); node.textContent = value; return node.innerHTML; };
    const updateSummary = () => {
      let itemCount = 0; let amount = 0; const lines = [];
      rows.forEach((row) => {
        const quantity = Math.max(0, Number(row.querySelector('[data-quick-quantity]').value) || 0);
        const option = selectedOption(row); const price = Number(option?.dataset.price) || 0;
        if (quantity > 0) lines.push({ title: row.dataset.title, variant: option?.textContent.trim(), quantity, amount: quantity * price });
        itemCount += quantity; amount += quantity * price;
      });
      count.textContent = itemCount; total.textContent = formatMoney(amount, currency); addAll.disabled = itemCount === 0;
      summaryEmpty.hidden = lines.length > 0;
      summaryLines.innerHTML = lines.map((line) => `<div class="nova-quick-summary-line"><strong>${escapeHtml(line.title)}</strong><span>${escapeHtml(line.variant)} · Qty ${line.quantity}</span><b>${formatMoney(line.amount, currency)}</b></div>`).join('');
    };
    const filterRows = () => {
      const term = search.value.trim().toLowerCase(); let shown = 0;
      rows.forEach((row) => {
        const matches = (!term || row.dataset.search.includes(term)) && (!filters.connection || row.dataset.connection === filters.connection) && (!filters.type || row.dataset.type === filters.type);
        row.hidden = !matches; if (matches) shown += 1;
      });
      visible.textContent = shown; empty.hidden = shown !== 0; clear.hidden = term === '';
    };
    const addItems = async (items) => {
      if (!items.length) return;
      status.textContent = 'Adding order to cart…'; addAll.disabled = true;
      try {
        const response = await fetch(`${window.Shopify?.routes?.root || '/'}cart/add.js`, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ items }) });
        if (!response.ok) throw new Error((await response.json()).description || 'Could not add the selected items.');
        status.textContent = 'Complete quick order added to cart.';
        document.dispatchEvent(new CustomEvent('cart:refresh'));
      } catch (error) { status.textContent = error.message; }
      updateSummary();
    };

    rows.forEach((row) => {
      const toggle = row.querySelector('[data-quick-toggle]'); const details = row.querySelector('[data-quick-details]');
      const variant = row.querySelector('[data-quick-variant]'); const quantity = row.querySelector('[data-quick-quantity]'); const add = row.querySelector('[data-quick-add]');
      toggle.addEventListener('click', () => {
        const open = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!open)); details.hidden = open;
        toggle.childNodes[0].textContent = open ? 'Select Options ' : 'Hide Options ';
      });
      const refreshVariant = () => {
        const option = selectedOption(row); const available = option?.dataset.available === 'true'; const price = Number(option?.dataset.price) || 0;
        row.querySelector('[data-quick-price]').textContent = formatMoney(price, currency); row.querySelector('[data-quick-unit-price]').textContent = formatMoney(price, currency);
        row.querySelector('[data-quick-sku]').textContent = option?.dataset.sku || '—'; row.querySelector('[data-quick-availability]').innerHTML = available ? '<i></i> In stock' : 'Sold out'; add.disabled = !available; updateSummary();
      };
      variant.addEventListener('change', refreshVariant); quantity.addEventListener('input', updateSummary);
      row.querySelector('[data-quick-minus]').addEventListener('click', () => { quantity.value = Math.max(0, Number(quantity.value || 0) - 1); updateSummary(); });
      row.querySelector('[data-quick-plus]').addEventListener('click', () => { quantity.value = Math.min(999, Number(quantity.value || 0) + 1); updateSummary(); });
      add.addEventListener('click', () => { quantity.value = Math.max(1, Number(quantity.value) || 1); updateSummary(); status.textContent = `${row.dataset.title} added to the order summary.`; });
      refreshVariant();
    });

    root.querySelectorAll('[data-quick-filter-group]').forEach((group) => group.querySelectorAll('[data-quick-filter]').forEach((button) => button.addEventListener('click', () => {
      group.querySelectorAll('[data-quick-filter]').forEach((item) => item.classList.toggle('is-active', item === button));
      filters[group.dataset.quickFilterGroup] = button.dataset.quickFilter; filterRows();
    })));
    search.addEventListener('input', filterRows); clear.addEventListener('click', () => { search.value = ''; filterRows(); search.focus(); });
    addAll.addEventListener('click', () => addItems(rows.filter((row) => selectedOption(row)?.dataset.available === 'true').map((row) => ({ id: Number(row.querySelector('[data-quick-variant]').value), quantity: Math.max(0, Number(row.querySelector('[data-quick-quantity]').value) || 0) })).filter((item) => item.quantity > 0)));
    filterRows(); updateSummary();
  };

  document.querySelectorAll('[data-nova-quick-order]').forEach(init);
  document.addEventListener('shopify:section:load', (event) => init(event.target.querySelector('[data-nova-quick-order]')));
})();
