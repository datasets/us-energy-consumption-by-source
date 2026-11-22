// Build data/energy-consumption.csv from the raw EIA files in archive/.
// Plain Node (22+), no dependencies. Deterministic: same archive in, same CSV out.
//
// Sources (see archive/PROVENANCE.md for URLs, retrieval date and sha256):
//   archive/eia-primary-energy-consumption-1635-1945.txt  pdftotext -layout of EIA's
//     "Estimated Primary Energy Consumption in the United States, Selected Years, 1635-1945"
//     (formerly Monthly Energy Review Appendix D, Table D1)
//   archive/eia-mer-table-1-3.csv   Monthly Energy Review Table 1.3, Primary Energy Consumption by Source
//   archive/eia-mer-table-10-1.csv  Monthly Energy Review Table 10.1 (used only for wood, 1949 on)
// Licence: US federal government work, public domain (eia.gov/about/copyrights_reuse.php).
//
// Run from the dataset root: node scripts/build.mjs

import { readFileSync, writeFileSync } from "node:fs";

const D1 = "D1-1635-1945";
const T13 = "MER-1.3";
const T101 = "MER-10.1";

const TOTALS = new Set(["fossil_fuels_total", "biomass_total", "renewables_total", "total_primary"]);

// Plain decimal string (no exponent), trailing zeros trimmed.
function plain(n) {
  if (!Number.isFinite(n)) throw new Error(`not a number: ${n}`);
  let s = n.toFixed(6);
  if (s.includes(".")) s = s.replace(/0+$/, "").replace(/\.$/, "");
  return s === "-0" ? "0" : s;
}

const rows = [];
function add(year, source, value, flag, table) {
  rows.push({ year, source, value, flag, table });
}

// ---- 1. Historic table, 1635-1945 (selected years) ----
// Column order in the table: coal, natural gas, petroleum, fossil-fuel total,
// conventional hydro, wood, renewable-energy total (= hydro + wood; checked
// below), electricity net imports, total. The table has no separate biomass
// total (its only biomass is wood), so we do not invent one.
const D1_COLS = [
  "coal", "natural_gas", "petroleum", "fossil_fuels_total", "hydroelectric",
  "wood", "renewables_total", "electricity_net_imports", "total_primary",
];
const txt = readFileSync("archive/eia-primary-energy-consumption-1635-1945.txt", "utf8");
const d1Years = new Set();
for (const line of txt.split("\n")) {
  const m = line.match(/^\s*(1[6-9]\d\d)\s+\.{3,}\s+(.*)$/);
  if (!m) continue;
  const year = Number(m[1]);
  const cells = m[2].trim().split(/\s+/);
  if (cells.length !== D1_COLS.length) throw new Error(`D1 ${year}: expected ${D1_COLS.length} cells, got ${cells.length}: ${m[2]}`);
  if (d1Years.has(year)) throw new Error(`D1 duplicate year ${year}`);
  d1Years.add(year);
  cells.forEach((raw, i) => {
    const source = D1_COLS[i];
    const cell = raw.replace(/^[ab]/, ""); // footnote marker, e.g. "a1.261" for 1945 wood
    if (cell === "NA" || cell === "––" || cell === "--") return; // not available / not applicable: no row
    if (cell === "(s)") return add(year, source, "", "s", D1);
    if (!/^\d*\.?\d+$/.test(cell)) throw new Error(`D1 ${year} ${source}: unexpected cell ${raw}`);
    add(year, source, plain(Number(cell)), "", D1);
  });
}
if (d1Years.size !== 42 || !d1Years.has(1635) || !d1Years.has(1945)) throw new Error(`D1: expected 42 selected years 1635-1945, got ${d1Years.size}`);

// ---- 2. Annual series from 1949: MER Table 1.3 (+ wood from Table 10.1) ----
function parseCsv(text) {
  const out = [];
  for (const line of text.replace(/\r/g, "").split("\n")) {
    if (!line) continue;
    const cells = [];
    const re = /"([^"]*)"|([^,]+)|(?<=,|^)(?=,|$)/g;
    let mm;
    while ((mm = re.exec(line)) !== null) {
      cells.push(mm[1] ?? mm[2] ?? "");
      if (re.lastIndex === mm.index) re.lastIndex++;
    }
    out.push(cells);
  }
  const [head, ...body] = out;
  return body.map((c) => Object.fromEntries(head.map((h, i) => [h, c[i]])));
}

const T13_MSN = {
  CLTCBUS: "coal",
  NNTCBUS: "natural_gas",
  PMTCBUS: "petroleum",
  FFTCBUS: "fossil_fuels_total",
  NUETBUS: "nuclear",
  HVTCBUS: "hydroelectric",
  GETCBUS: "geothermal",
  SOTCBUS: "solar",
  WYTCBUS: "wind",
  BMTCBUS: "biomass_total",
  RETCBUS: "renewables_total",
  TETCBUS: "total_primary",
};

// Annual rows have month "13". Only full years are published as annual rows.
function annual(file, msnMap, table, divisor, unit) {
  const recs = parseCsv(readFileSync(file, "utf8"));
  for (const r of recs) {
    const source = msnMap[r.MSN];
    if (!source || !/^\d{4}13$/.test(r.YYYYMM)) continue;
    if (r.Unit !== unit) throw new Error(`${file} ${r.MSN}: unit ${r.Unit}, expected ${unit}`);
    const year = Number(r.YYYYMM.slice(0, 4));
    if (r.Value === "Not Available") continue;
    const v = Number(r.Value);
    if (r.Value === "" || !Number.isFinite(v)) throw new Error(`${file} ${r.MSN} ${r.YYYYMM}: bad value ${r.Value}`);
    add(year, source, plain(v / divisor), "", table);
  }
}
annual("archive/eia-mer-table-1-3.csv", T13_MSN, T13, 1, "Quadrillion Btu");
annual("archive/eia-mer-table-10-1.csv", { WDTCBUS: "wood" }, T101, 1000, "Trillion Btu");

// ---- 3. Checks, sort, write ----
const seen = new Set();
for (const r of rows) {
  const k = `${r.year}|${r.source}`;
  if (seen.has(k)) throw new Error(`duplicate key ${k}`);
  seen.add(k);
}
for (const y of [1946, 1947, 1948]) if (rows.some((r) => r.year === y)) throw new Error(`unexpected year ${y}`);
const maxYear = Math.max(...rows.map((r) => r.year));
if (maxYear !== 2025) throw new Error(`expected last full year 2025, got ${maxYear}`);

// Totals add up (within rounding) for the historic table.
for (const y of d1Years) {
  const get = (s) => Number(rows.find((r) => r.year === y && r.source === s)?.value || 0);
  const ren = get("hydroelectric") + get("wood");
  if (Math.abs(ren - get("renewables_total")) > 0.0015) throw new Error(`D1 ${y}: renewables ${get("renewables_total")} vs hydro+wood ${ren}`);
  const parts = get("fossil_fuels_total") + get("renewables_total") + get("electricity_net_imports");
  if (Math.abs(parts - get("total_primary")) > 0.0025) throw new Error(`D1 ${y}: total ${get("total_primary")} vs parts ${parts}`);
}

const ORDER = [
  "coal", "natural_gas", "petroleum", "fossil_fuels_total", "nuclear",
  "hydroelectric", "geothermal", "solar", "wind", "wood", "biomass_total",
  "renewables_total", "electricity_net_imports", "total_primary",
];
rows.sort((a, b) => a.year - b.year || ORDER.indexOf(a.source) - ORDER.indexOf(b.source));

const header = "year,source,quadrillion_btu,flag,is_total,source_table";
const lines = rows.map((r) => [r.year, r.source, r.value, r.flag, TOTALS.has(r.source), r.table].join(","));
writeFileSync("data/energy-consumption.csv", [header, ...lines].join("\n") + "\n");
console.log(`wrote data/energy-consumption.csv: ${rows.length} rows, ${new Set(rows.map((r) => r.year)).size} years`);
