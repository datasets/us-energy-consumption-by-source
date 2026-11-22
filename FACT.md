# Fact check: us-energy-consumption-by-source

Claim (README "What stands out"): The US burned less coal in 2025 than in 1905. EIA puts 2025 coal consumption at 8.67 quadrillion Btu, below its estimate of 10.00 for 1905 and 38% of the 2005 peak of 22.80. In 2024 it fell to 7.91, the lowest in the annual series that starts in 1949; the last estimate lower than that is 6.84 for 1900. Wood is ahead of coal in 1880 (2.85 against 2.05) and coal is ahead by 1885 (2.84 against 2.68).

Exact values in `data/energy-consumption.csv`:

| year | source | quadrillion_btu | source_table |
|---|---|---|---|
| 1880 | coal | 2.054 | D1-1635-1945 |
| 1880 | wood | 2.851 | D1-1635-1945 |
| 1885 | coal | 2.84 | D1-1635-1945 |
| 1885 | wood | 2.683 | D1-1635-1945 |
| 1900 | coal | 6.841 | D1-1635-1945 |
| 1905 | coal | 10.001 | D1-1635-1945 |
| 2005 | coal | 22.796543 | MER-1.3 (maximum of all coal rows) |
| 2024 | coal | 7.912213 | MER-1.3 (minimum of MER-1.3 coal rows) |
| 2025 | coal | 8.670671 | MER-1.3 |

2025 / 2005 = 0.3804 (38%). 1900 is the latest year before 2024 with coal at or below 7.912213. Also: 2025 total_primary = 96.465716 (README intro: 96.47).

Recompute (run in the dataset root):

```sh
node -e 'const r=require("fs").readFileSync("data/energy-consumption.csv","utf8").trim().split("\n").slice(1).map(l=>l.split(","));const c=r.filter(x=>x[1]=="coal").map(x=>[+x[0],+x[2],x[5]]);const v=y=>c.find(x=>x[0]==y)[1];const mx=c.reduce((a,b)=>b[1]>a[1]?b:a);const mn=c.filter(x=>x[2]=="MER-1.3").reduce((a,b)=>b[1]<a[1]?b:a);const w=y=>+r.find(x=>x[0]==y&&x[1]=="wood")[2];console.log({c2025:v(2025),c1905:v(1905),peak:mx,share:(v(2025)/mx[1]).toFixed(4),min49:mn,lastLower:c.filter(x=>x[0]<2024&&x[1]<=v(2024)).pop(),c1880:v(1880),w1880:w(1880),c1885:v(1885),w1885:w(1885)})'
```

Things to check: the 1880/1885 and 1900/1905 values against page 1 of the archived PDF (`archive/eia-primary-energy-consumption-1635-1945.pdf`); that pre-1949 coal is apparent consumption from Schurr and Netschert while 1949 on is MER Table 1.3 (stated in README); 2025 figures are from the October 2026 MER and may be revised.
