# Provenance

All files retrieved on 2026-11-22 from www.eia.gov with a generic User-Agent (`datasets-commons-wrangler`). Publisher: US Energy Information Administration (EIA), US Department of Energy.

| File | URL | sha256 |
|---|---|---|
| `eia-primary-energy-consumption-1635-1945.pdf` | https://www.eia.gov/energyexplained/us-energy-facts/images/U.S._Primary_Energy_Consumption_1635-1945.pdf | `dddc9050c5f8aa22fbf7097c042338f1345141109e1724a44494c9c2b7d8fc82` |
| `eia-primary-energy-consumption-1635-1945.txt` | text of the PDF above, made with `pdftotext -layout` (Poppler pdftotext 26.08.0) | `99cca2e0dd7c1f2d8417fe06c787f67460acb84d18943af3d691ca33f0bdcc53` |
| `eia-mer-table-1-3.csv` | https://www.eia.gov/totalenergy/data/browser/csv.php?tbl=T01.03 | `cdd863a7954933ba441d0946c6a06a32a91b6c193390eb65f53b46903179ed0e` |
| `eia-mer-table-10-1.csv` | https://www.eia.gov/totalenergy/data/browser/csv.php?tbl=T10.01 | `569bf9f38992a668ed788c6a3990434d19eaabab60e5c89ce1ade41f54cd8ea4` |

- The 1635-1945 PDF is dated October 2026. It is EIA's "Estimated primary energy consumption in the United States, selected years, 1635-1945", formerly Monthly Energy Review (MER) Appendix D, Table D1. The MER page (https://www.eia.gov/totalenergy/data/monthly/) says: "We moved Estimated primary energy consumption in the United States, Selected Years, 1635-1945 (Appendix D). You can find these data in a special report", linking to https://www.eia.gov/energyexplained/us-energy-facts/estimated-consumption-1635-1945.php.
- The two CSVs are from the MER data browser. The MER page showed "Release Date: October 29, 2026" (the October 2026 MER) on the retrieval date. The CSVs carry annual rows (month code 13) for 1949-2025 and monthly rows to July 2026; only annual rows are used. 2025 figures may be revised again.
- The text extraction is archived so `scripts/build.mjs` can run without a PDF parser. The build checks that every one of the 42 table rows has 9 cells and that the totals add up.

## Licence

From EIA's Copyrights and Reuse page, https://www.eia.gov/about/copyrights_reuse.php, quoted verbatim:

> Public domain and use of EIA content
>
> U.S. government publications are in the public domain and are not subject to copyright protection. You may use and/or distribute any of our data, files, databases, reports, graphs, charts, and other information products that are on our website or that you receive through our email distribution service. However, if you use or reproduce any of our information products, you should use an acknowledgment, which includes the publication date, such as: "Source: U.S. Energy Information Administration (Oct 2008)."

The same page notes that some photographs, illustrations and the EIA logo are protected; none are included here.

Acknowledgment for this dataset: Source: U.S. Energy Information Administration, Monthly Energy Review (October 2026) and Estimated Primary Energy Consumption in the United States, Selected Years, 1635-1945 (October 2026).
