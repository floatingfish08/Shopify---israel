# Nova Implants Shopify Theme

Custom U.S.-market storefront theme for Nova Implants, built on Shopify's Dawn foundation.

## Workflow

- `main` is the Shopify-connected production branch.
- Develop and review changes on a feature branch before merging to `main`.
- Shopify Theme Editor changes on a connected theme are committed back to the connected branch.

## Validation

Run Shopify Theme Check before merging:

```sh
npx @shopify/cli theme check
```

## Store-admin dependencies

Theme code does not configure products, inventory, payment processors, shipping rates, domains, markets, policies, or navigation menus. Those remain Shopify Admin data and must be configured separately.

Regulatory claims must only be published when supported by Nova's current product-specific documentation. The included theme intentionally does not claim FDA approval or FDA 510(k) clearance.

## Supplied documents

- ISO 13485:2016 certificate, registration IL-99180, expiry 2027-08-21
- Dental Implant System IFU, supplied as TF-1008 revision 8

The IFU source contains a document-number discrepancy on its final page and should be replaced after Nova confirms the current controlled copy. Compliance PDFs are deliberately excluded from Git history. Upload approved controlled copies to Shopify Files and configure their URLs in the **Nova clinical resources** section.
