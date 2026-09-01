const fs = require('fs');
const path = require('path');

const assetBase = 'https://vqpqqw-ci.myshopify.com/cdn/shop/t/6/assets/';
const price = '25.00';

const products = [
  {
    title: 'Plastic Abutment for Casting', handle: 'nova-plastic-abutment-for-casting', type: 'Restorative Components',
    tags: 'featured,casting,plastic,restorative,internal-hex,regular-platform,nova-usa',
    description: '<p>Castable plastic abutment for custom laboratory restorations on the NOVA regular-platform internal-hex connection. The 8 mm working length supports wax-up and conventional casting workflows.</p><ul><li>Internal hex · regular platform</li><li>Engaging and non-engaging options</li><li>Laboratory fabrication workflow</li><li>Select by catalog number before ordering</li></ul><p><strong>Professional use only.</strong> Confirm compatibility, current labeling and applicable Instructions for Use.</p>',
    variants: [['PIS-0013','Engaging · L 8 mm','nova-shop-plastic-2.webp'],['PIS-0012','Non-engaging · L 8 mm','nova-shop-plastic-1.webp']],
    extraImages: ['nova-shop-plastic-3.webp','nova-shop-plastic-4.webp','nova-shop-plastic-5.webp']
  },
  {
    title: 'Chrome Cobalt Abutment / UCLA', handle: 'nova-chrome-cobalt-abutment-ucla', type: 'CAD/CAM & Casting Components',
    tags: 'featured,chrome-cobalt,ucla,casting,internal-hex,regular-platform,nova-usa',
    description: '<p>Chrome-cobalt UCLA abutment for custom cast restorations on the NOVA regular-platform internal-hex connection. A castable plastic sleeve is included for the laboratory workflow.</p><ul><li>Internal hex · regular platform</li><li>Engaging and non-engaging options</li><li>0.5 mm platform height</li><li>Castable plastic sleeve included</li></ul><p><strong>Professional use only.</strong> Confirm compatibility, current labeling and applicable Instructions for Use.</p>',
    variants: [['ABZ-SV-RPCC','Engaging · H 0.5 mm','nova-shop-chrome-cobalt.webp'],['ABZ-SV-RPCCR','Non-engaging · H 0.5 mm','nova-shop-chrome-cobalt.webp']]
  },
  {
    title: 'Ball Attachment', handle: 'nova-ball-attachment', type: 'Overdenture Components',
    tags: 'featured,ball-attachment,overdenture,internal-hex,regular-platform,nova-usa',
    description: '<p>Titanium ball attachment for removable overdenture retention on the NOVA regular-platform internal-hex connection. Six gingival heights support different soft-tissue depths.</p><ul><li>Internal hex · regular platform</li><li>Heights from 1 mm to 6 mm</li><li>For overdenture retention workflows</li><li>Match with the appropriate housing and insert</li></ul><p><strong>Professional use only.</strong> Confirm compatibility, current labeling and applicable Instructions for Use.</p>',
    variants: [1,2,3,4,5,6].map((h) => [`BAT-00${h}0`,`H ${h} mm`,`nova-shop-ball-${h}.webp`])
  },
  {
    title: 'Flat Locator Abutment', handle: 'nova-flat-locator-abutment', type: 'Overdenture Components',
    tags: 'featured,locator,overdenture,internal-hex,nova-usa,catalog-number-pending',
    description: '<p>Low-profile locator-style abutment family for removable overdenture workflows. The client-supplied product image shows heights from 1 mm through 8 mm.</p><ul><li>Low-profile overdenture connection</li><li>Eight gingival-height options</li><li>Use with the matching retention components</li><li>Catalog numbers pending final client confirmation</li></ul><p><strong>Professional use only.</strong> Do not fulfill until the exact catalog number, connection and current labeling have been confirmed.</p>',
    variants: [1,2,3,4,5,6,7,8].map((h) => ['',`H ${h} mm`,'nova-shop-flat-locator.webp'])
  },
  {
    title: 'Angled Titanium Pop-Clicq — 18°', handle: 'nova-angled-titanium-pop-clicq-18', type: 'Multi-Unit Solutions',
    tags: 'featured,pop-clicq,angled,overdenture,titanium,internal-hex,regular-platform,nova-usa',
    description: '<p>Angled titanium Pop-Clicq component for correcting restorative trajectory in overdenture and full-arch workflows. The 18° family is available in four gingival heights.</p><ul><li>18° angulation</li><li>Internal hex · regular platform</li><li>Gingival heights 1–4 mm</li><li>Titanium restorative component</li></ul><p><strong>Professional use only.</strong> Confirm compatibility, current labeling and applicable Instructions for Use.</p>',
    variants: [['LOCW-SV-RP1805K','H 1 mm','nova-shop-pop-clicq-18.webp'],['LOCW-SV-RP1810K','H 2 mm','nova-shop-pop-clicq-18.webp'],['LOCW-SV-RP1820K','H 3 mm','nova-shop-pop-clicq-18.webp'],['LOCW-SV-RP1830K','H 4 mm','nova-shop-pop-clicq-18.webp']]
  },
  {
    title: 'Angled Titanium Pop-Clicq — 30°', handle: 'nova-angled-titanium-pop-clicq-30', type: 'Multi-Unit Solutions',
    tags: 'featured,pop-clicq,angled,overdenture,titanium,internal-hex,regular-platform,nova-usa',
    description: '<p>Angled titanium Pop-Clicq component for correcting restorative trajectory in overdenture and full-arch workflows. The 30° family is available in four gingival heights.</p><ul><li>30° angulation</li><li>Internal hex · regular platform</li><li>Gingival heights 1–4 mm</li><li>Titanium restorative component</li></ul><p><strong>Professional use only.</strong> Confirm compatibility, current labeling and applicable Instructions for Use.</p>',
    variants: [['LOCW-SV-RP3005K','H 1 mm','nova-shop-pop-clicq-30.webp'],['LOCW-SV-RP3010K','H 2 mm','nova-shop-pop-clicq-30.webp'],['LOCW-SV-RP3020K','H 3 mm','nova-shop-pop-clicq-30.webp'],['LOCW-SV-RP3030K','H 4 mm','nova-shop-pop-clicq-30.webp']]
  },
  {
    title: 'Slim Titanium Healing Abutment', handle: 'nova-slim-titanium-healing-abutment', type: 'Healing Abutments',
    tags: 'featured,healing,slim,titanium,internal-hex,nova-usa,catalog-number-pending',
    description: '<p>Slim-profile titanium healing abutment for soft-tissue management after implant placement. Client-supplied product renders show 4 mm, 6 mm and 7 mm heights.</p><ul><li>Slim profile for reduced restorative space</li><li>Titanium construction</li><li>Heights 4 mm, 6 mm and 7 mm</li><li>Catalog numbers pending final client confirmation</li></ul><p><strong>Professional use only.</strong> Do not fulfill until the exact catalog number, connection and current labeling have been confirmed.</p>',
    variants: [['','H 4 mm','nova-shop-healing-slim-4.webp'],['','H 6 mm','nova-shop-healing-slim-6.webp'],['','H 7 mm','nova-shop-healing-slim-7.webp']]
  },
  {
    title: 'Surgical Hand Tools', handle: 'nova-surgical-hand-tools', type: 'Surgical Instruments',
    tags: 'featured,surgical,hand-tools,drivers,nova-usa',
    description: '<p>NOVA hand tools for surgical and laboratory screw-driving workflows. Select the required driver by catalog number and hex interface.</p><ul><li>AR 2040 surgical screw driver · hex 6.35 mm</li><li>LABK 1010 laboratory screw driver · hex 1.25 mm</li><li>Reusable instrument workflow</li><li>Review cleaning and sterilization instructions before use</li></ul><p><strong>Professional use only.</strong> Confirm compatibility, current labeling and applicable Instructions for Use.</p>',
    variants: [['AR 2040','Surgical screw driver · hex 6.35 mm','nova-shop-surgical-driver.webp'],['LABK 1010','Laboratory screw driver · hex 1.25 mm','nova-shop-surgical-driver.webp']]
  }
];

const header = ['Title','URL handle','Description','Vendor','Product category','Type','Tags','Published on online store','Status','SKU','Barcode','Option1 name','Option1 value','Option1 Linked To','Option2 name','Option2 value','Option2 Linked To','Option3 name','Option3 value','Option3 Linked To','Price','Compare-at price','Cost per item','Charge tax','Tax code','Unit price total measure','Unit price total measure unit','Unit price base measure','Unit price base measure unit','Inventory tracker','Inventory quantity','Continue selling when out of stock','Weight value (grams)','Weight unit for display','Requires shipping','Fulfillment service','Product image URL','Image position','Image alt text','Variant image URL','Gift card','SEO title','SEO description','Color (product.metafields.shopify.color-pattern)','Google Shopping / Google product category','Google Shopping / Gender','Google Shopping / Age group','Google Shopping / Manufacturer part number (MPN)','Google Shopping / Ad group name','Google Shopping / Ads labels','Google Shopping / Condition','Google Shopping / Custom product','Google Shopping / Custom label 0','Google Shopping / Custom label 1','Google Shopping / Custom label 2','Google Shopping / Custom label 3','Google Shopping / Custom label 4'];
const esc = (value='') => /[",\n]/.test(String(value)) ? `"${String(value).replaceAll('"','""')}"` : String(value);
const rows = [];
for (const product of products) {
  let imagePosition = 1;
  product.variants.forEach(([sku, option, image], index) => {
    const first = index === 0;
    const row = Object.fromEntries(header.map((key) => [key, '']));
    Object.assign(row, {
      Title: first ? product.title : '', 'URL handle': product.handle, Description: first ? product.description : '',
      Vendor: first ? 'NOVA Implants USA' : '', Type: first ? product.type : '', Tags: first ? product.tags : '',
      'Published on online store': first ? 'TRUE' : '', Status: first ? 'Active' : '', SKU: sku,
      'Option1 name': first ? 'Configuration' : '', 'Option1 value': option, Price: price, 'Charge tax': 'TRUE',
      'Inventory tracker': 'shopify', 'Inventory quantity': '500', 'Continue selling when out of stock': 'DENY',
      'Requires shipping': 'TRUE', 'Fulfillment service': 'manual', 'Product image URL': `${assetBase}${image}`,
      'Image position': String(imagePosition++), 'Image alt text': `${product.title} — ${option}`, 'Variant image URL': `${assetBase}${image}`,
      'Gift card': first ? 'FALSE' : '', 'SEO title': first ? `${product.title} | NOVA Implants USA` : '',
      'SEO description': first ? `Shop ${product.title} from NOVA Implants USA. Professional-use dental component with selectable configurations and free U.S. shipping.` : '',
      'Google Shopping / Manufacturer part number (MPN)': sku, 'Google Shopping / Condition': 'New', 'Google Shopping / Custom product': 'TRUE'
    });
    rows.push(header.map((key) => esc(row[key])).join(','));
  });
  for (const image of product.extraImages || []) {
    const row = Object.fromEntries(header.map((key) => [key, '']));
    row['URL handle'] = product.handle;
    row['Product image URL'] = `${assetBase}${image}`;
    row['Image position'] = String(imagePosition++);
    row['Image alt text'] = product.title;
    rows.push(header.map((key) => esc(row[key])).join(','));
  }
}

const output = path.join(__dirname, '..', 'docs', 'nova-usa-8-products.csv');
fs.writeFileSync(output, `${header.map(esc).join(',')}\n${rows.join('\n')}\n`);
console.log(JSON.stringify({ output, products: products.length, variants: products.reduce((n,p)=>n+p.variants.length,0), price, inventoryPerVariant: 500 }, null, 2));
