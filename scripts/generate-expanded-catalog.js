const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const sourceFiles = [
  path.join(root, 'docs/nova-complete-catalog-drafts.csv'),
  path.join(root, 'docs/nova-implant-products-draft.csv'),
];
const outputFile = path.join(root, 'docs/nova-expanded-catalog-update.csv');
const assetBase = 'https://vqpqqw-ci.myshopify.com/cdn/shop/t/6/assets/';

const excludedHandles = new Set([
  'pci-implant-system',
  'plastic-abutment-for-casting',
  'chrome-cobalt-abutment-ucla',
  'ball-attachment',
  'angled-titanium-pop-click-18',
  'angled-titanium-pop-clicq-18',
  'angled-titanium-pop-click-30',
  'angled-titanium-pop-clicq-30',
  'surgical-hand-tools',
]);

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (char === '"') {
      if (quoted && text[i + 1] === '"') {
        field += '"';
        i += 1;
      } else {
        quoted = !quoted;
      }
    } else if (char === ',' && !quoted) {
      row.push(field);
      field = '';
    } else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && text[i + 1] === '\n') i += 1;
      row.push(field);
      if (row.some((value) => value !== '')) rows.push(row);
      row = [];
      field = '';
    } else {
      field += char;
    }
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function encodeCsv(rows) {
  return `${rows.map((row) => row.map((value) => {
    const text = String(value ?? '');
    return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  }).join(',')).join('\n')}\n`;
}

const imageByType = {
  'Dental Implants': 'nova-product-psi.webp',
  'Healing Abutments': 'nova-shop-healing-slim-4.webp',
  'Restorative Components': 'nova-shop-chrome-cobalt.webp',
  'Impression Components': 'nova-shop-plastic-2.webp',
  'Multi-Unit Solutions': 'nova-shop-pop-clicq-18.webp',
  'Digital & Casting Components': 'nova-shop-chrome-cobalt.webp',
  'Surgical Instruments': 'nova-shop-surgical-driver.webp',
};

const parsed = sourceFiles.map((file) => parseCsv(fs.readFileSync(file, 'utf8')));
const header = parsed[0][0];
const index = Object.fromEntries(header.map((name, position) => [name, position]));
const outputRows = [header];
let productCount = 0;
let variantCount = 0;

for (const table of parsed) {
  let includeProduct = false;
  let currentType = '';
  let currentTitle = '';
  for (const sourceRow of table.slice(1)) {
    const row = [...sourceRow];
    while (row.length < header.length) row.push('');
    const handle = row[index['URL handle']];
    const title = row[index.Title];

    if (title) {
      includeProduct = !excludedHandles.has(handle);
      currentType = row[index.Type];
      currentTitle = title;
      if (includeProduct) productCount += 1;
    }
    if (!includeProduct || !handle) continue;

    const hasVariant = Boolean(row[index.SKU] || row[index['Option1 value']] || row[index['Option2 value']]);
    if (!hasVariant) continue;

    row[index.Price] = '25.00';
    row[index['Charge tax']] = 'TRUE';
    row[index['Inventory tracker']] = 'shopify';
    row[index['Inventory quantity']] = '500';
    row[index['Continue selling when out of stock']] = 'DENY';
    row[index['Requires shipping']] = 'TRUE';
    row[index['Fulfillment service']] = 'manual';
    row[index['Weight value (grams)']] = '';
    row[index['Weight unit for display']] = '';

    if (title) {
      row[index.Vendor] = 'NOVA Implants USA';
      row[index['Published on online store']] = 'TRUE';
      row[index.Status] = 'Active';
      row[index.Tags] = `${row[index.Tags]},nova-usa,expanded-catalog`.replace(/^,/, '');
      const image = imageByType[currentType] || 'nova-shop-chrome-cobalt.webp';
      row[index['Product image URL']] = `${assetBase}${image}`;
      row[index['Image position']] = '1';
      row[index['Image alt text']] = `${currentTitle} — NOVA Implants USA`;
      row[index['Variant image URL']] = `${assetBase}${image}`;
      row[index['SEO title']] = `${currentTitle} | NOVA Implants USA`;
      row[index['SEO description']] = `Shop ${currentTitle} from NOVA Implants USA. Professional-use dental component with selectable catalog configurations.`;
    } else {
      row[index['Product image URL']] = '';
      row[index['Image position']] = '';
      row[index['Image alt text']] = '';
      row[index['Variant image URL']] = '';
    }

    outputRows.push(row.slice(0, header.length));
    variantCount += 1;
  }
}

fs.writeFileSync(outputFile, encodeCsv(outputRows));
console.log(`Generated ${productCount} products and ${variantCount} variants at ${outputFile}`);
