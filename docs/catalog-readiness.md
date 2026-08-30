# NOVA catalog readiness map

Source reviewed: `catalog 2024.pdf` (cover dated 2024; internal page footer dated 2023).

## Storefront families

| Collection | Catalog coverage | Readiness |
| --- | --- | --- |
| Dental implants | PSI and PCI systems, diameter/length variants | Imported as two draft products; price, weight, stock and final surface-treatment mapping required |
| Healing abutments | Titanium 3 mm/5 mm and concave titanium variants | Catalog numbers mapped visually; commercial data required |
| Restorative components | Temporary, PEEK, straight, angled, anatomic, zirconia and ball attachments | Commercial data and exact compatibility rules required |
| Impression components | Closed/open tray, straight/angled transfer and casting components | Commercial data required |
| Multi-unit solutions | Pop-Click / Multi Click straight, angled, bar kits and components | Commercial data and kit contents confirmation required |
| Digital solutions | Ti bases, scan bodies, pre-milled blanks and abutment gauges | Commercial data and compatibility confirmation required |
| Surgical tools | Nova kit, drills, drivers, guide pins, ratchets and tools | Commercial data and kit composition confirmation required |

## Required owner data before products can be activated

- USD selling price for every SKU
- packaged weight and customs/shipping data
- inventory quantity and fulfillment location
- the surface treatment offered for each implant SKU
- final product photography approved for ecommerce
- product-specific regulatory/market authorization wording
- confirmation that the supplied IFU is the current controlled copy

## Controlled-document note

The supplied IFU is headed **TF-1008, revision 8**, but its final footer reads **TF-1006/Ver.08/27.04.2021**. Keep the storefront link unpublished until NOVA confirms the correct controlled document.

## Draft import scope

`nova-implant-products-draft.csv` was imported on August 30, 2026, creating PSI and PCI as **draft**, unpublished products with 56 total variants. Prices are intentionally `0.00`; inventory and weights are intentionally unset. These records must not be activated until the required commercial and compliance data above is complete.

- PSI Shopify product ID: `7527979319381`
- PCI Shopify product ID: `7527979352149`

The approved product catalog and ISO 13485 certificate are hosted in Shopify Files and linked from the unpublished review theme. The IFU remains unlinked pending controlled-copy confirmation.

The remaining visible catalog tables have been transcribed into `nova-complete-catalog-drafts.csv`. On August 30, 2026, the file was imported into the actual Shopify store as 50 additional draft products with 172 variants. Together with PSI and PCI, the store now contains 52 draft products and 228 cataloged variants. Source discrepancies and exclusions are documented in `catalog-source-review.md`.
