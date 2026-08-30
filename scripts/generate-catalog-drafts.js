const fs = require('fs');
const path = require('path');

const p = (title, handle, type, tags, variants, note = '') => ({ title, handle, type, tags, variants, note });
const products = [
  p('Titanium Healing Abutment — 3 mm', 'titanium-healing-abutment-3mm', 'Healing Abutments', 'healing,titanium', [
    ['HCN-3030', 'H 3 mm · Ø 3.8 mm'], ['HCN-3040', 'H 3 mm · Ø 4.5 mm'],
    ['HCN-3050', 'H 3 mm · Ø 5.0 mm'], ['HCN-3070', 'H 3 mm · Ø 7.0 mm'],
  ]),
  p('Titanium Healing Abutment — 5 mm', 'titanium-healing-abutment-5mm', 'Healing Abutments', 'healing,titanium,catalog-review', [
    ['HCN-3050', 'H 5 mm · Ø 3.8 mm'], ['HC-4050', 'H 5 mm · Ø 4.6 mm'],
    ['HC-5050', 'H 5 mm · Ø 5.5 mm'], ['HCW-6050', 'H 5 mm · Ø 6.3 mm'],
  ]),
  p('Concave Titanium Healing Abutment', 'concave-titanium-healing-abutment', 'Healing Abutments', 'healing,concave,titanium', [
    ['HAC-SV-RP30', 'H 3 mm · Ø 4.5 mm'], ['HAC-SV-RP50', 'H 5 mm · Ø 4.5 mm'],
  ]),
  p('Temporary Titanium Abutment', 'temporary-titanium-abutment', 'Restorative Components', 'temporary,titanium,restorative', [
    ['TTA-SV-RP', 'Engaging · L 8 mm'], ['TTA-SV-RPR', 'Non-engaging · L 8 mm'],
  ]),
  p('PEEK Straight Abutment', 'peek-straight-abutment', 'Restorative Components', 'peek,straight,restorative', [
    ['PA-SV-RP10', 'H 1 mm'], ['PA-SV-RP20', 'H 2 mm'], ['PA-SV-RP30', 'H 3 mm'], ['PA-SV-RP40', 'H 4 mm'],
  ]),
  p('PEEK Anatomic Angled Abutment — 15°', 'peek-anatomic-angled-abutment-15', 'Restorative Components', 'peek,angled,restorative', [
    ['PAA-SV-RP1510', 'H 1 mm · L 9.5 mm'], ['PAA-SV-RP1520', 'H 2 mm · L 10.5 mm'], ['PAA-SV-RP1530', 'H 3 mm · L 11.5 mm'],
  ]),
  p('PEEK Anatomic Angled Abutment — 25°', 'peek-anatomic-angled-abutment-25', 'Restorative Components', 'peek,angled,restorative', [
    ['PAA-SV-RP2510', 'H 1 mm · L 9.5 mm'], ['PAA-SV-RP2520', 'H 2 mm · L 10.5 mm'], ['PAA-SV-RP2530', 'H 3 mm · L 11.5 mm'],
  ]),
  p('Straight Abutment — Ø 4.5 mm', 'straight-abutment-4-5mm', 'Restorative Components', 'straight,titanium,restorative,catalog-review', [
    ['SA-SV-RP5', 'L 5 mm'], ['SA-SV-RP7', 'L 7 mm'], ['ST-1109', 'L 9 mm'], ['ST-1113', 'L 12 mm'], ['ST-1315', 'L 15 mm'],
  ]),
  p('Straight Abutment — Wide Ø 5.5 mm', 'straight-abutment-wide-5-5mm', 'Restorative Components', 'straight,wide,titanium,restorative', [
    ['SA-SV-RP9W', 'L 9 mm'], ['SA-SV-RP12W', 'L 12 mm'],
  ]),
  p('Straight Slim Abutment', 'straight-slim-abutment', 'Restorative Components', 'straight,slim,titanium,restorative', [
    ['SSA-SV-RP5', 'L 5 mm'], ['SSA-SV-RP7', 'L 7 mm'], ['STN-3811', 'L 9 mm'],
  ]),
  p('Angled Abutment — 15°', 'angled-abutment-15', 'Restorative Components', 'angled,titanium,restorative', [
    ['ANS-1115', 'Profile N · L 9 mm'], ['ASM-1115', 'Profile M · L 9 mm'], ['ASM-1315', 'Profile M · L 11.5 mm'],
  ]),
  p('Angled Abutment — 25°', 'angled-abutment-25', 'Restorative Components', 'angled,titanium,restorative', [
    ['ANS-1125', 'Profile N · L 9 mm'], ['ASM-1125', 'Profile M · L 9 mm'], ['ASM-1325', 'Profile M · L 11.5 mm'],
  ]),
  p('Angled Abutment — 35° / 45°', 'angled-abutment-35-45', 'Restorative Components', 'angled,titanium,restorative', [
    ['ASM-1135', '35° · L 9 mm'], ['ASM-1145', '45° · L 9 mm'],
  ]),
  p('Straight Abutment with Shoulder', 'straight-abutment-with-shoulder', 'Restorative Components', 'straight,shoulder,titanium,restorative', [
    ['TSTA-4710', 'H 1 mm'], ['STA-4712', 'H 2 mm'], ['STA-4713', 'H 3 mm'], ['STA-4714', 'H 4 mm'],
  ]),
  p('Anatomic Straight Abutment', 'anatomic-straight-abutment', 'Restorative Components', 'anatomic,straight,titanium,restorative', [
    ['SLM-3810', 'H 1 mm · L 9.4 mm'], ['SLM-3820', 'H 2 mm · L 10.4 mm'],
    ['SLM-3830', 'H 3 mm · L 11.4 mm'], ['SLM-3840', 'H 4 mm · L 12.4 mm'],
  ]),
  p('Concave Anatomic Straight Abutment', 'concave-anatomic-straight-abutment', 'Restorative Components', 'concave,anatomic,straight,titanium,restorative', [
    ['SCM-3010', 'H 1 mm · L 9.4 mm'], ['SCM-3020', 'H 2 mm · L 10.4 mm'], ['SCM-3030', 'H 3 mm · L 11.4 mm'],
  ]),
  p('Anatomic Angled Abutment — 15°', 'anatomic-angled-abutment-15', 'Restorative Components', 'anatomic,angled,titanium,restorative', [
    ['ANG-1115-10', 'H 1 mm · L 9.4 mm'], ['ANG-1215-20', 'H 2 mm · L 10.4 mm'],
    ['ANG-1315-30', 'H 3 mm · L 11.4 mm'], ['ANG-1415-40', 'H 4 mm · L 12.4 mm'],
  ]),
  p('Concave Anatomic Angled Abutment — 15°', 'concave-anatomic-angled-abutment-15', 'Restorative Components', 'concave,anatomic,angled,titanium,restorative', [
    ['ANT-1115-10', 'H 1 mm · L 9.4 mm'], ['ANT-1215-20', 'H 2 mm · L 10.4 mm'],
    ['ANT-1315-30', 'H 3 mm · L 11.4 mm'], ['ANT-1415-40', 'H 4 mm · L 12.4 mm'],
  ]),
  p('Anatomic Angled Abutment — 25°', 'anatomic-angled-abutment-25', 'Restorative Components', 'anatomic,angled,titanium,restorative', [
    ['ANG-1125-10', 'H 1 mm · L 9.4 mm'], ['ANG-1225-20', 'H 2 mm · L 10.4 mm'],
    ['ANG-1325-30', 'H 3 mm · L 11.4 mm'], ['ANG-1425-40', 'H 4 mm · L 12.4 mm'],
  ]),
  p('Concave Anatomic Angled Abutment — 25°', 'concave-anatomic-angled-abutment-25', 'Restorative Components', 'concave,anatomic,angled,titanium,restorative', [
    ['ANT-1125-10', 'H 1 mm · L 9.4 mm'], ['ANT-1225-20', 'H 2 mm · L 10.4 mm'],
    ['ANT-1325-30', 'H 3 mm · L 11.4 mm'], ['ANT-1425-40', 'H 4 mm · L 12.4 mm'],
  ]),
  p('Closed Tray Impression Coping — Narrow Ø 4 mm', 'closed-tray-impression-coping-narrow-4mm', 'Impression Components', 'impression,closed-tray', [
    ['CT-SV-RPSN', 'L 9 mm'], ['CT-SV-RPLN', 'L 11 mm'],
  ]),
  p('Straight Transfer Abutment', 'straight-transfer-abutment', 'Impression Components', 'transfer,straight,impression', [
    ['TMC-0910', 'H 1 mm'], ['TMC-0930', 'H 3 mm'],
  ]),
  p('Angled Transfer Abutment — 15°', 'angled-transfer-abutment-15', 'Impression Components', 'transfer,angled,impression', [
    ['TAP-SV-RP1510', 'H 1 mm'], ['TAP-SV-RP1520', 'H 2 mm'], ['TAP-SV-RP1530', 'H 3 mm'],
  ]),
  p('Angled Transfer Abutment — 25°', 'angled-transfer-abutment-25', 'Impression Components', 'transfer,angled,impression', [
    ['TAP-SV-RP2510', 'H 1 mm'], ['TAP-SV-RP2520', 'H 2 mm'], ['TAP-SV-RP2530', 'H 3 mm'],
  ]),
  p('Open Tray Impression Coping', 'open-tray-impression-coping', 'Impression Components', 'impression,open-tray', [['TRO-1310', 'L 12 mm']]),
  p('Plastic Abutment for Casting', 'plastic-abutment-for-casting', 'Restorative Components', 'casting,plastic,restorative', [
    ['PIS-0013', 'Engaging · L 8 mm'], ['PIS-0012', 'Non-engaging · L 8 mm'],
  ]),
  p('Straight Titanium Pop-Clicq Mini Kit', 'straight-titanium-pop-clicq-mini-kit', 'Multi-Unit Solutions', 'pop-clicq,overdenture,titanium', [
    ['LOCW-SV-RP05K', 'H 0.5 mm'], ['LOCW-SV-RP10K', 'H 1 mm'], ['LOCW-SV-RP20K', 'H 2 mm'],
    ['LOCW-SV-RP30K', 'H 3 mm'], ['LOCW-SV-RP40K', 'H 4 mm'], ['LOCW-SV-RP50K', 'H 5 mm'], ['LOCW-SV-RP60K', 'H 6 mm'],
  ]),
  p('Angled Titanium Pop-Clicq — 18°', 'angled-titanium-pop-clicq-18', 'Multi-Unit Solutions', 'pop-clicq,angled,overdenture,titanium', [
    ['LOCW-SV-RP1805K', 'H 1 mm'], ['LOCW-SV-RP1810K', 'H 2 mm'], ['LOCW-SV-RP1820K', 'H 3 mm'], ['LOCW-SV-RP1830K', 'H 4 mm'],
  ]),
  p('Angled Titanium Pop-Clicq — 30°', 'angled-titanium-pop-clicq-30', 'Multi-Unit Solutions', 'pop-clicq,angled,overdenture,titanium', [
    ['LOCW-SV-RP3005K', 'H 1 mm'], ['LOCW-SV-RP3010K', 'H 2 mm'], ['LOCW-SV-RP3020K', 'H 3 mm'], ['LOCW-SV-RP3030K', 'H 4 mm'],
  ]),
  p('Multi Clicq Bar On4 Kit', 'multi-clicq-bar-on4-kit', 'Multi-Unit Solutions', 'multi-clicq,bar,kit', [
    ['MUL-SV-BK4', 'MUL-SV-BK4'], ['MUL-SV-BK4D', 'MUL-SV-BK4D'],
  ]),
  p('Multi Clicq Bar On6 Kit', 'multi-clicq-bar-on6-kit', 'Multi-Unit Solutions', 'multi-clicq,bar,kit', [
    ['MUL-SV-BK6', 'MUL-SV-BK6'], ['MUL-SV-BK6D', 'MUL-SV-BK6D'],
  ]),
  p('Multi Clicq Straight Abutment', 'multi-clicq-straight-abutment', 'Multi-Unit Solutions', 'multi-clicq,straight,abutment', [
    ['SU-0031', 'H 1 mm'], ['SU-0032', 'H 2 mm'], ['SU-0033', 'H 3 mm'], ['SU-0034', 'H 4 mm'], ['SU-0035', 'H 5 mm'],
  ]),
  p('One-Piece Angled Abutment Mini Kit — 17°', 'one-piece-angled-abutment-mini-kit-17', 'Multi-Unit Solutions', 'multi-clicq,angled,abutment,kit', [
    ['MS-1702', 'H 2 mm'], ['MS-1703', 'H 3 mm'], ['MS-1704', 'H 4 mm'],
  ]),
  p('One-Piece Angled Abutment Mini Kit — 30°', 'one-piece-angled-abutment-mini-kit-30', 'Multi-Unit Solutions', 'multi-clicq,angled,abutment,kit', [
    ['MS-3003', 'H 3 mm'], ['MS-3004', 'H 4 mm'], ['MS-3005', 'H 5 mm'],
  ]),
  p('Multi Clicq Components', 'multi-clicq-components', 'Multi-Unit Solutions', 'multi-clicq,components', [
    ['MUL-KS-TSSV', 'Prosthetic titanium screw'], ['NM-9000', 'Abutment analog'], ['MS-5006', 'Open tray plastic transfer'],
    ['MUL-KS-HA', 'Healing cap'], ['MS-4009', 'Temporary titanium sleeve'], ['MS-5001', 'Castable plastic sleeve'],
  ]),
  p('Zircocam Straight Anatomic Abutment', 'zircocam-straight-anatomic-abutment', 'Digital & Zirconia Components', 'zircocam,zirconia,straight,anatomic', [
    ['ZAA-SV-RP10', 'H 1 mm'], ['ZAA-SV-RP20', 'H 2 mm'], ['ZAA-SV-RP30', 'H 3 mm'],
  ]),
  p('Zircotec Angled Anatomic Abutment — 15°', 'zircotec-angled-anatomic-abutment-15', 'Digital & Zirconia Components', 'zircotec,zirconia,angled,anatomic', [['ZAAU-SV-RP15', 'H 1.5 mm · L 9.5 mm']]),
  p('Zircocam Angled Anatomic Abutment — 15°', 'zircocam-angled-anatomic-abutment-15', 'Digital & Zirconia Components', 'zircocam,zirconia,angled,anatomic', [
    ['ZAA-SV-RP1510', 'H 1 mm'], ['ZAA-SV-RP1520', 'H 2 mm'], ['ZAA-SV-RP1530', 'H 3 mm'],
  ]),
  p('Zircocam Angled Anatomic Abutment — 25°', 'zircocam-angled-anatomic-abutment-25', 'Digital & Zirconia Components', 'zircocam,zirconia,angled,anatomic', [
    ['ZAA-SV-RP2510', 'H 1 mm'], ['ZAA-SV-RP2520', 'H 2 mm'], ['ZAA-SV-RP2530', 'H 3 mm'],
  ]),
  p('Ball Attachment', 'ball-attachment', 'Multi-Unit Solutions', 'ball-attachment,overdenture', [
    ['BAT-0010', 'H 1 mm'], ['BAT-0020', 'H 2 mm'], ['BAT-0030', 'H 3 mm'],
    ['BAT-0040', 'H 4 mm'], ['BAT-0050', 'H 5 mm'], ['BAT-0060', 'H 6 mm'],
  ]),
  p('Ball Attachment Components', 'ball-attachment-components', 'Multi-Unit Solutions', 'ball-attachment,components,overdenture', [
    ['SIL-0001', 'Transparent insert'], ['SIL-0002', 'Pink insert'], ['HUS-0000', 'Metal housing'],
  ]),
  p('Chrome Cobalt Abutment / UCLA', 'chrome-cobalt-abutment-ucla', 'Digital & Casting Components', 'chrome-cobalt,ucla,casting', [
    ['ABZ-SV-RPCC', 'Engaging · H 0.5 mm'], ['ABZ-SV-RPCCR', 'Non-engaging · H 0.5 mm'],
  ]),
  p('Titanium Base', 'titanium-base', 'Digital & Casting Components', 'titanium-base,digital', [
    ['ABZ-SV-RPTI', 'Engaging · H 0.5 mm'], ['ABZ-SV-RPTIR', 'Non-engaging · H 0.5 mm'],
  ]),
  p('Titanium Base — Sirona CEREC Compatible', 'titanium-base-sirona-cerec', 'Digital & Casting Components', 'titanium-base,sirona-cerec,digital', [
    ['TBC-SV-RP05', 'Engaging · H 0.8 mm · Ø 4.5 mm'], ['TBC-SV-RP05R', 'Non-engaging · H 0.8 mm · Ø 4.5 mm'],
  ]),
  p('PEEK Scan Body', 'peek-scan-body', 'Digital & Casting Components', 'peek,scan-body,digital', [
    ['SB-SV-RP', 'Internal hex'], ['SB-TBC', 'Sirona CEREC compatible'],
  ]),
  p('Pre-Milled Titanium Blank', 'pre-milled-titanium-blank', 'Digital & Casting Components', 'pre-milled,titanium-blank,cad-cam,digital', [
    ['PMAM-SV-RP', 'Arum compatible'], ['PMMX-SV-RP', 'Manix / MegaGen (ZX 4SA) compatible'],
    ['PMAG-SV-RP', 'Amann Girrbach compatible'], ['PMZZ-SV-RP', 'Zirkonzahn compatible'],
  ]),
  p('Abutment Gauge Kit', 'abutment-gauge-kit', 'Digital & Casting Components', 'abutment-gauge,kit', [['AG-SV-RPK', 'Kit']]),
  p('Abutment Gauge', 'abutment-gauge', 'Digital & Casting Components', 'abutment-gauge,digital', [
    ['AG-SV-RP00', 'Straight · H 1–5 mm'], ['AG-SV-RP1700', '17° · H 1–5 mm'], ['AG-SV-RP3000', '30° · H 1–5 mm'],
  ]),
  p('Nova Surgical Kit Components', 'nova-surgical-kit-components', 'Surgical Instruments', 'surgical,kit-components,drills,drivers', [
    ['DR-5019', 'Round bur Ø 1.9 mm · without irrigation'], ['DR-5020', 'Pilot drill Ø 2.0 mm'],
    ['DR-5028', 'Drill Ø 2.8 mm'], ['DR-5032', 'Drill Ø 3.2 mm'], ['DR-5038', 'Drill Ø 3.8 mm'],
    ['DR-5042', 'Drill Ø 4.2 mm'], ['DR-5048', 'Drill Ø 4.8 mm'], ['GP-1020', 'Guide pin 10 mm × 2'],
    ['GP-1320', 'Guide pin 13 mm × 2'], ['HD-2507', 'Hex driver 1.25 · L 7 mm'],
    ['HD-2510', 'Hex driver 1.25 · L 10 mm'], ['HD-4207', 'Hex driver 2.42 · L 7 mm'],
    ['HD-4215', 'Hex driver 2.42 · L 15 mm'], ['MG-4228', 'Motor mount 2.42 hex · L 28 mm'],
    ['MG-2522', 'Motor mount 1.25 hex · L 22 mm'], ['MG-2528', 'Motor mount 2.42 hex · L 20 mm'],
    ['RC-2030', 'Ratchet'], ['RC-2050', 'Torque ratchet'], ['MC-0001', 'Metal container'],
  ], 'The catalog also lists a drill extension without a catalog number; that item is excluded pending identification.'),
  p('Surgical Hand Tools', 'surgical-hand-tools', 'Surgical Instruments', 'surgical,hand-tools,drivers', [
    ['AR 2040', 'Surgical screw driver · hex 6.35 mm'], ['LABK 1010', 'Laboratory screw driver · hex 1.25 mm'],
  ]),
];

const header = [
  'Title','URL handle','Description','Vendor','Product category','Type','Tags','Published on online store','Status','SKU','Barcode',
  'Option1 name','Option1 value','Option1 Linked To','Option2 name','Option2 value','Option2 Linked To','Option3 name','Option3 value','Option3 Linked To',
  'Price','Compare-at price','Cost per item','Charge tax','Tax code','Unit price total measure','Unit price total measure unit','Unit price base measure',
  'Unit price base measure unit','Inventory tracker','Inventory quantity','Continue selling when out of stock','Weight value (grams)','Weight unit for display',
  'Requires shipping','Fulfillment service','Product image URL','Image position','Image alt text','Variant image URL','Gift card','SEO title','SEO description',
  'Color (product.metafields.shopify.color-pattern)','Google Shopping / Google product category','Google Shopping / Gender','Google Shopping / Age group',
  'Google Shopping / Manufacturer part number (MPN)','Google Shopping / Ad group name','Google Shopping / Ads labels','Google Shopping / Condition',
  'Google Shopping / Custom product','Google Shopping / Custom label 0','Google Shopping / Custom label 1','Google Shopping / Custom label 2',
  'Google Shopping / Custom label 3','Google Shopping / Custom label 4',
];
const csv = (value) => {
  const text = String(value ?? '');
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
};
const rows = [];
for (const product of products) {
  product.variants.forEach(([sku, variant], index) => {
    const first = index === 0;
    const row = Object.fromEntries(header.map((key) => [key, '']));
    row.Title = first ? product.title : '';
    row['URL handle'] = product.handle;
    row.Description = first
      ? `<p>${product.title} variants transcribed from the supplied NOVA product catalog. Use the catalog number and displayed dimensions to identify the required component.</p>${product.note ? `<p><strong>Catalog review note:</strong> ${product.note}</p>` : ''}<p><strong>Professional use only.</strong> Confirm compatibility, labeling and the current Instructions for Use before ordering or clinical use.</p>`
      : '';
    row.Vendor = first ? 'NOVA Implants' : '';
    row.Type = first ? product.type : '';
    row.Tags = first ? `${product.tags},internal-hex,regular-platform,catalog-2024` : '';
    row['Published on online store'] = first ? 'FALSE' : '';
    row.Status = first ? 'Draft' : '';
    row.SKU = sku;
    row['Option1 name'] = first ? (product.variants.length === 1 ? 'Title' : 'Variant') : '';
    row['Option1 value'] = product.variants.length === 1 ? 'Default Title' : variant;
    row.Price = '0.00';
    row['Continue selling when out of stock'] = 'DENY';
    row['Requires shipping'] = 'TRUE';
    row['Fulfillment service'] = 'manual';
    row['Gift card'] = first ? 'FALSE' : '';
    row['SEO title'] = first ? `${product.title} | NOVA Implants` : '';
    row['SEO description'] = first ? `Cataloged ${product.title} variants for trained dental professionals. Confirm compatibility, labeling and current IFU before ordering.` : '';
    row['Google Shopping / Manufacturer part number (MPN)'] = sku;
    row['Google Shopping / Condition'] = 'New';
    row['Google Shopping / Custom product'] = 'TRUE';
    rows.push(header.map((key) => csv(row[key])).join(','));
  });
}
const outputPath = path.join(__dirname, '..', 'docs', 'nova-complete-catalog-drafts.csv');
fs.writeFileSync(outputPath, `${header.map(csv).join(',')}\n${rows.join('\n')}\n`);
const skus = products.flatMap((product) => product.variants.map(([sku]) => sku));
const duplicateSkus = [...new Set(skus.filter((sku, index) => skus.indexOf(sku) !== index))];
console.log(JSON.stringify({ outputPath, products: products.length, variants: skus.length, duplicateSkus }, null, 2));
