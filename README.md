How much energy the United States has used each year, and from which sources, from colonial firewood in 1635 to 2025. Figures are primary energy consumption in quadrillion British thermal units (Btu), from the US Energy Information Administration (EIA). For scale, the US used 96.47 quadrillion Btu in 2025.

EIA publishes two separate series, and this dataset joins them without filling the gap: its historical estimates for selected years from 1635 to 1945 (every 10 years to 1845, then every 5 years), and its annual figures from 1949 to 2025. There are no figures for 1946-1948, and no values are interpolated.

## What stands out

Measured by energy content, the US burned less coal in 2025 than in 1905. EIA puts 2025 coal consumption at 8.67 quadrillion Btu, below its estimate of 10.00 for 1905 and 38% of the 2005 peak of 22.80. In 2024 it fell to 7.91, the lowest in the annual series that starts in 1949; the last estimate lower than that is 6.84 for 1900. By weight the comparison flips: 2025's 452 million short tons (EIA MER Table 6.1) is more than 1905's, because today's coal is lower-grade and carries less energy per ton.

Coal had only taken over from wood in the 1880s: in EIA's estimates wood is ahead in 1880 (2.85 against 2.05 quadrillion Btu) and coal is ahead by 1885 (2.84 against 2.68). The table has no years in between, so the exact year of the crossover is not known.

Caveats: coal before 1949 is apparent consumption (production plus imports minus exports) from a different underlying source than the annual series, and the 2025 figures may still be revised.

## Data

`data/energy-consumption.csv`: one row per year and energy source (1,137 rows, 119 years).

- `year`: calendar year. For 1635-1845 each value is EIA's annual average for the decade, which EIA assigns to the decade's fifth year (1635, 1645 and so on).
- `source`: `coal`, `natural_gas`, `petroleum`, `fossil_fuels_total`, `nuclear`, `hydroelectric`, `geothermal`, `solar`, `wind`, `wood`, `biomass_total`, `renewables_total`, `electricity_net_imports`, `total_primary`.
- `quadrillion_btu`: consumption in quadrillion Btu, as published (3 decimals to 1945, full precision from 1949).
- `flag`: `s` where EIA prints (s), less than 0.5 trillion Btu; the value is then left empty. This applies only to 1635.
- `is_total`: `true` for the subtotals and totals (`fossil_fuels_total`, `biomass_total`, `renewables_total`, `total_primary`). Don't add these to the individual sources.
- `source_table`: where the value comes from. `D1-1635-1945` is EIA's historical estimates table (formerly Monthly Energy Review Appendix D, Table D1). `MER-1.3` is Monthly Energy Review Table 1.3. `MER-10.1` is Monthly Energy Review Table 10.1, used only for wood from 1949 (converted from trillion Btu).

Where EIA shows a source as not available or not applicable (for example coal before 1850, or nuclear before 1949), there is no row. Solar and wind start in the 1980s and geothermal in 1960.

Gaps and differences between the two series:

- **Wood and biomass.** To 1945 wood means fuelwood only and is the only biomass in the historical table, so there is no `biomass_total` before 1949. From 1949 `wood` is wood and wood-derived fuels (EIA notes this discontinuity), and `biomass_total` also includes waste and biofuels.
- **Renewables total.** To 1945 `renewables_total` is hydroelectric plus wood. From 1949 it also covers geothermal, solar, wind and all biomass.
- **Electricity.** Hydroelectric, geothermal, solar and wind are counted at the heat content of the electricity, 3,412 Btu per kilowatthour. EIA adopted this "captured energy" approach for these tables in September 2023; the historical table converts hydro the same way. Many older sources used a "fossil fuel equivalency" factor that gave these sources roughly three times as much weight, so their figures will be higher.
- **Totals.** `electricity_net_imports` is shown separately only to 1945. From 1949 `total_primary` includes electricity net imports and coal coke net imports, which EIA does not show separately in Table 1.3, so the sources do not add exactly to the total.
- **Natural gas and petroleum.** From 1949 natural gas excludes supplemental gaseous fuels and petroleum excludes biofuels (which are in biomass).
- **Coverage.** From 1949 the figures cover the 50 states and DC. Before that, coverage grew with settlement: the wood series starts with 12 of the original colonies plus Maine, Vermont and the future DC, and covers the Lower 48 by 1810.

## Source and licence

- EIA, Estimated Primary Energy Consumption in the United States, Selected Years, 1635-1945 (October 2026): https://www.eia.gov/energyexplained/us-energy-facts/estimated-consumption-1635-1945.php
- EIA, Monthly Energy Review (October 2026), Table 1.3 Primary Energy Consumption by Source and Table 10.1 Renewable Energy Production and Consumption by Source: https://www.eia.gov/totalenergy/data/monthly/

EIA's own sources for the historical estimates are Energy in the American Economy, 1850-1975 (Schurr and Netschert) and, for wood before 1850, the US Department of Agriculture's Fuel Wood Used in the United States 1630-1930 (1942).

Licence: public domain (US-PD). EIA says: "U.S. government publications are in the public domain and are not subject to copyright protection." It asks users to acknowledge the source with the publication date (https://www.eia.gov/about/copyrights_reuse.php). Source: U.S. Energy Information Administration (October 2026).

This is a frozen snapshot taken on 2026-11-22. `scripts/build.mjs` rebuilds the CSV from the raw EIA files in `archive/`.
