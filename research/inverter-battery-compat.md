# Inverter–battery compatibility — sources and doubts

Checked on **2026-10-27**. Code: `src/content/battery-compat.ts` (the 36 pairs with Albanian and English text, used by `sizeSystem()` in `src/lib/solar.ts`). Raw research: `inverter-battery-compat.json` (the matrix as the research produced it: 36 pairs with every source and quote, the reconciler's notes, the voltage windows, each maker researcher's findings and the skeptics' votes).

## Method
1. **Eight maker researchers**, one per maker (Deye, Fronius, GoodWe, Growatt, Huawei, BYD, Dyness, Pylontech), read only the makers' own documents: compatibility lists, datasheets, manuals and official product pages. No reseller page counts as a source.
2. **A reconciler** merged both sides of every pair into one verdict with these rules:
   - **compatible**: at least one maker lists this exact pair and no maker excludes it;
   - **not compatible**: a maker excludes it, a maker's list is closed (it says only listed batteries are approved) and leaves it out, or the battery voltage cannot meet the inverter's battery input;
   - **unknown**: neither maker lists it and neither excludes it. Unknown pairs are **never paired automatically**.
3. **Two independent skeptics per compatible pair** tried to refute it, one through the sources (are the documents live, current, on the maker's domain, and do they say what is quoted) and one through the models (is it the exact variant in the catalogue). **All 10 compatible pairs survived.** Their more precise conditions, and the newer maker documents they found, are folded into the code.

Rule for battery power: `batteryPowerKw` holds only a figure a maker states for the pair (Fronius's solution-sheet tables; Huawei's 3.5 kW per LUNA2000 module). GoodWe's figures are our arithmetic (25 A × the battery's nominal voltage) and appear only as a condition worded as an estimate.

## Result: 10 compatible, 24 not compatible, 2 unknown

| Inverter ↓ / battery → | BYD HVS 10.2 | BYD HVM 11.0 | Dyness PowerBox G3 | Fronius Reserva 6.3 | Huawei LUNA2000-7-S1 | Pylontech US5000 |
|---|---|---|---|---|---|---|
| Deye SUN-10K-SG04LP3-EU | no | no | **yes** (battery maker only) | no | no | **yes** (both makers) |
| Fronius Symo GEN24 10.0 Plus | **yes** (both makers, 9.01 kW) | **yes** (both makers, 4.51 kW) | no | **yes** (same maker, 4.51 kW) | unknown | no |
| Fronius Primo GEN24 5.0 Plus | no | **yes** (both makers, 4.51 kW) | no | **yes** (same maker, 4.51 kW) | unknown | no |
| GoodWe GW10K-ET (ET PLUS+) | **yes** (both makers) | **yes** (both makers) | no | no | no | no |
| Growatt MOD 10KTL3-XH | no | no | no | no | no | no |
| Huawei SUN2000-10KTL-M1 | no | no | no | no | **yes** (same maker, 3.5 kW) | no |

"kW" is the battery charge/discharge power a maker states for that pair. The two catalogue inverters with no battery input, `huawei-sun2000-30ktl-m3` and `sma-sunny-tripower-10` (specs `hybrid = 0`, `battery_ready = 0`), are not in the matrix and are never paired.

## Battery voltage windows (makers' figures)
| Product | Battery voltage | Source |
|---|---|---|
| Deye SUN-10K-SG04LP3-EU (inverter battery input) | 40-60 V DC (48 V low-voltage), max 210 A charge/discharge, CAN/RS485 BMS link | [link](https://www.deyeinverter.com/deyeinverter/2024/10/21/datasheet_sun-5-12k-sg04lp3_241021_en.pdf) |
| Fronius Symo GEN24 10.0 Plus (inverter battery input) | 160-700 V DC, max 22 A, max battery power 10.3 kW (depends on the battery) | [link](https://www.fronius.com/en/help-center/solar-energy/products/solar-inverters/gen24/symo-gen24-plus/fronius-symo-gen24-10-0-plus) |
| Fronius Primo GEN24 5.0 Plus (inverter battery input) | 150-455 V DC, AC derating from 419.7 V, max 22 A, max battery power 5170 W | [link](https://www.fronius.com/en/help-center/solar-energy/products/solar-inverters/gen24/primo-gen24-plus/fronius-primo-gen24-5-0-plus) |
| GoodWe GW10K-ET, ET PLUS+ (inverter battery input) | 180-600 V DC, 500 V nominal, 180 V start-up, 25 A max continuous charge/discharge, CAN (default) or RS485 | [link](https://emea.goodwe.com/Ftp/Downloads/Datasheet/EMEA/GW_ET%20PLUS+_Datasheet_EMEA-EN.pdf) |
| Growatt MOD 10KTL3-XH, standard non-BP (inverter battery input) | 600-950 V DC; 'Compatible battery (only) ARK-XH HV Battery (7.68-25.6 kWh)'; max 18.5 A, 10 kW charge, 11 kW discharge. The BP variant is also 600-950 V but takes 'APX HV Battery (only)', at 25 A and 15 kW charge. | [link](https://en.growatt.com/upload/file/MOD_3-10KTL3-XH_User_Manual_EN_202405.pdf) |
| Huawei SUN2000-10KTL-M1 (inverter battery input) | 600-980 V DC, max 16.7 A, 10 kW charge/discharge; only LUNA2000-S0/S1 are allowed | [link](https://solar.huawei.com/en/products/sun2000-3-4-5-6-8-10ktl-m1/specs/) |
| BYD Battery-Box Premium HVS 10.2 | 409.6 V nominal, 320-480 V operating (4 x 102.4 V modules) | [link](https://www.bydbatterybox.com/uploads/downloads/241212_Datasheet_Battery-Box%20HVS_V1.4_EN-675a34b4e7bfb.pdf) |
| BYD Battery-Box Premium HVM 11.0 | 204.8 V nominal, 160-236 V operating (4 x 51.2 V modules) | [link](https://www.bydbatterybox.com/uploads/downloads/241212_Datasheet_Battery-Box%20HVM_V1.4_EN-675a34784afeb.pdf) |
| Dyness PowerBox G3 | 51.2 V nominal, 44.8-57.6 V working range, 200 Ah / 10.24 kWh per module, low-voltage (User Manual V4.0, 2026-09-18) | [link](https://www.dyness.com/Public/Uploads/uploadfile/files/20260920/PowerboxG3UserManualEN20260918.pdf) |
| Fronius Reserva 6.3 | 204.8 V rated, 185.6-227.2 V (2 x 102.4 V modules). The Fronius manual gives the output range as 179.2-230.4 V. | [link](https://www.fronius.com/~/downloads/Solar%20Energy/Datasheets/SE_DS_FroniusReserva_DA.pdf) |
| Huawei LUNA2000-7-S1 (LUNA2000-10KW-C1 + 1 x LUNA2000-7-E1) | Output of the DC-DC power module: 350-560 V (450 V rated) in single-phase systems, 600-980 V (600 V rated) in three-phase systems; 3.5 kW max with one module | [link](https://solar.huawei.com/dam/asset/view/36414e3c762a4e508d6fde579866c4c0.pdf) |
| Pylontech US5000 | 48 V nominal, 43.5-53.5 V discharge, 52.5-53.5 V charge (Installation Manual V1.0, 2024-09-25) | [link](https://en.pylontech.com.cn/profile/upload/2024/09/25/RESS-Installation%20Manual-US5000%20US5000-B%205PMPA08-00219_V1.0_20240925124144A058.pdf) |

## The compatible pairs: conditions and sources

### Deye SUN-10K-SG04LP3-EU + Dyness PowerBox G3
Listed by: battery maker only.

Dyness lists this inverter for the PowerBox G3. Deye’s own battery list does not name the G3 (only older Dyness models) and asks buyers to confirm with the battery maker.

Conditions:
- Battery link: CAN, from the battery’s CAN IN port to the inverter’s BMS port, with the Dyness cable labelled for the inverter.
- On the master battery, DIP switch #3 goes ON (Dyness’s setting for Deye); any other batteries stay at 0000.
- Neither maker publishes Deye’s Lithium-mode number for the G3: confirm it with Dyness before commissioning.
- The inverter takes up to 210 A of battery current; one G3 module gives 200 A continuous (100 A recommended), so full power needs at least 2 modules, and 3 to stay at the recommended current.

Sources:
- [List of the Inverter Brands Compatible with Dyness Low-voltage Batteries](https://www.dyness.com/Public/Uploads/uploadfile/files/20260727/DynessLowvoltageBatteriesCampatibilityList20260715.pdf), 2026-07-15 (battery side)
- [Dyness Powerbox G3 User Manual V4.0](https://www.dyness.com/Public/Uploads/uploadfile/files/20260920/PowerboxG3UserManualEN20260918.pdf), 2026-09-18 (battery side)
- [Dyness Powerbox G3 datasheet](https://www.dyness.com/Public/Uploads/uploadfile/files/20261016/DynessPowerboxG3Datasheeten20261009.pdf), 2026-10-09 (battery side)
- [Deye Approved Battery list DY-LV48-0128](https://www.deyeinverter.com/deyeinverter/2026/09/07/DeyeApprovedBatterylistDY-LV48-0128.pdf), 2026-09-04 (inverter side)
- [Deye SUN-5-12K-SG04LP3 datasheet](https://www.deyeinverter.com/deyeinverter/2024/10/21/datasheet_sun-5-12k-sg04lp3_241021_en.pdf), 2024-10-21 (inverter side)

### Deye SUN-10K-SG04LP3-EU + Pylontech US5000
Listed by: both makers.

Both makers list this pair: Deye for the SUN-10K-SG04LP3-EU, Pylontech for the SG04LP3 series, over CAN.

Conditions:
- Battery link: CAN, with the inverter’s battery mode set to Lithium, code 00 (Deye’s list). Deye also lists RS485 with another code; use CAN, which both makers list.
- The inverter takes up to 210 A of battery current; one US5000 gives up to 100 A continuous (80 A recommended). A single module limits the battery power; 210 A needs at least 3 modules.
- Neither maker gives a minimum firmware version for this pair.

Sources:
- [Deye Approved Battery list DY-LV48-0128](https://www.deyeinverter.com/deyeinverter/2026/09/07/DeyeApprovedBatterylistDY-LV48-0128.pdf), 2026-09-04 (inverter side)
- [Compatibility List of Pylontech Low Voltage ESS and Inverters Ver.2.46](https://en.pylontech.com.cn/profile/upload/2026/07/17/Compatibility%20List%20of%20Pylontech%20Low%20Voltage%20ESS%20and%20Inverters%20Ver.2.46_1784254097873.pdf), 2026-07-07 (battery side)
- [Deye SUN-5-12K-SG04LP3 datasheet](https://deyeinverter.com/deyeinverter/2025/05/16/datasheet_sun-5-12k-sg04lp3.pdf), 2025-05-16 (inverter side)
- [Pylontech US5000 Installation Manual V1.0](https://en.pylontech.com.cn/profile/upload/2024/09/25/RESS-Installation%20Manual-US5000%20US5000-B%205PMPA08-00219_V1.0_20240925124144A058.pdf), 2024-09-25 (battery side)

### Fronius Symo GEN24 10.0 Plus + BYD HVS 10.2
Listed by: both makers. Battery power (maker figure): 9.01 kW.

Both makers list this pair. Fronius gives 9.01 kW of battery charge and discharge power with the HVS 10.2.

Conditions:
- Minimum firmware for one battery tower: inverter 1.9.7-0, BYD BMU 3.13 and BMS 3.19.
- Both makers ask for the latest firmware on the inverter and the battery.
- Battery link: Modbus RTU (RS485) over a shielded 4-wire cable, CAT5 or better; the end of the line is terminated with the DIP switch on the battery.
- A Fronius Smart Meter is required at the grid connection; a three-phase model suits the three-phase Symo.
- More storage: up to 3 towers in parallel, each with the same number of modules, never HVS mixed with HVM; parallel needs inverter 1.10.5-0, BMU 3.14 and BMS 3.20.
- Fronius ties availability to certification in each country; the documents do not mention Albania, so confirm with the distributor.

Sources:
- [Fronius Battery Storage Solution: BYD Battery-Box HVS/HVM, HVS+/HVM+ (EN V13)](https://www.fronius.com/~/downloads/Solar%20Energy/Solution%20Sheets/SE_SOLS_Batterystorage_byd_EN.pdf), 2026-05 (inverter side)
- [BYD Battery-Box Premium HVS&HVM Compatible Inverter List V2.22](https://www.bydbatterybox.com/uploads/downloads/261010_BYD_Battery_Box_Premium_HVS&HVM_Compatible_Inverter_List_V2.22-6ac9d0a3b853b.pdf), 2026-10-10 (battery side)
- [Fronius help center: BYD Battery-Box Premium HVS/HVM](https://www.fronius.com/en/help-center/solar-energy/products/solar-energy-storage/solutions/byd/byd-battery-box-premium-hvshvm), undated page (inverter side)

### Fronius Symo GEN24 10.0 Plus + BYD HVM 11.0
Listed by: both makers. Battery power (maker figure): 4.51 kW.

Both makers list this pair, but with the HVM 11.0 Fronius gives only 4.51 kW of battery power on this 10 kW inverter.

Conditions:
- Minimum firmware for one battery tower: inverter 1.9.7-0, BYD BMU 3.13 and BMS 3.19.
- Both makers ask for the latest firmware on the inverter and the battery.
- More battery power needs a larger HVM (13.8: 5.63 kW; 16.6: 6.76 kW; 19.3: 7.88 kW; 22.1: 9.01 kW) or the HVS 10.2 (9.01 kW).
- Battery link: Modbus RTU (RS485) over a shielded 4-wire cable, CAT5 or better; the end of the line is terminated with the DIP switch on the battery.
- A Fronius Smart Meter is required at the grid connection; a three-phase model suits the three-phase Symo.
- More storage: up to 3 towers in parallel, each with the same number of modules, never HVS mixed with HVM; parallel needs inverter 1.10.5-0, BMU 3.14 and BMS 3.20. Battery power does not grow with parallel towers.
- Fronius ties availability to certification in each country; the documents do not mention Albania, so confirm with the distributor.

Sources:
- [BYD Battery-Box Premium HVS&HVM Compatible Inverter List V2.22](https://www.bydbatterybox.com/uploads/downloads/261010_BYD_Battery_Box_Premium_HVS&HVM_Compatible_Inverter_List_V2.22-6ac9d0a3b853b.pdf), 2026-10-10 (battery side)
- [Fronius Battery Storage Solution: BYD Battery-Box HVS/HVM, HVS+/HVM+ (EN V13)](https://www.fronius.com/~/downloads/Solar%20Energy/Solution%20Sheets/SE_SOLS_Batterystorage_byd_EN.pdf), 2026-05 (inverter side)
- [Fronius help center: BYD Battery-Box Premium HVS/HVM](https://www.fronius.com/en/help-center/solar-energy/products/solar-energy-storage/solutions/byd/byd-battery-box-premium-hvshvm), undated page (inverter side)

### Fronius Symo GEN24 10.0 Plus + Fronius Reserva 6.3
Listed by: same maker. Battery power (maker figure): 4.51 kW.

Fronius lists its own Reserva 6.3 with this inverter, at 4.51 kW of battery charge and discharge power.

Conditions:
- Fronius gives no minimum firmware version: the inverter and the battery must both run the latest software (the inverter updates through Solar.web).
- Battery link: Modbus RTU (RS485) over a shielded 4-wire cable, CAT5 or better.
- A Fronius Smart Meter is required at the grid connection; a three-phase model suits the three-phase Symo.
- More battery power needs a larger Reserva: the 9.5 gives 6.76 kW, the 12.6 gives 9.01 kW, the 15.8 gives 10.30 kW.
- More storage: up to 4 Reserva towers in parallel, each with the same number of modules, with total output capped at 32 A.
- Full backup when the grid fails is possible with this inverter, with extra switchover hardware; the switchover rules vary by country.
- Fronius ties availability to certification in each country; the documents do not mention Albania, so confirm with the distributor.

Sources:
- [Fronius Battery Storage Solution: Fronius Reserva (EN V10)](https://www.fronius.com/~/downloads/Solar%20Energy/Solution%20Sheets/SE_SOLS_Batterystorage_Fronius_Reserva_EN.pdf), 2025-12 (inverter+battery side)
- [Fronius Reserva datasheet (EN V09)](https://www.fronius.com/~/downloads/Solar%20Energy/Datasheets/SE_DS_Fronius_Reserva_EN.pdf), 2026-09 (inverter+battery side)
- [Fronius compatible batteries](https://www.fronius.com/en/solar-energy/solar-solutions/solar-energy-storage/compatible-batteries), undated page (inverter side)

### Fronius Primo GEN24 5.0 Plus + BYD HVM 11.0
Listed by: both makers. Battery power (maker figure): 4.51 kW.

Both makers list this pair. Fronius gives 4.51 kW of battery charge and discharge power with the HVM 11.0.

Conditions:
- Minimum firmware: inverter 1.11.6-0, BYD BMU 3.15 and BMS 3.21 (the same for parallel towers).
- Both makers ask for the latest firmware on the inverter and the battery.
- BYD allows 4 to 7 HVM modules on the Primo: the HVM 11.0 has 4; the HVM 8.3 and 22.1 are not allowed.
- 5.17 kW, the Primo’s highest battery power, needs the HVM 13.8 or larger.
- Battery link: Modbus RTU (RS485) over a shielded 4-wire cable, CAT5 or better; the end of the line is terminated with the DIP switch on the battery.
- A Fronius Smart Meter is required at the grid connection; a single-phase model suits the single-phase Primo.
- More storage: up to 3 towers in parallel, each with the same number of modules, never HVS mixed with HVM; battery power stays at the one-tower figure.
- Fronius ties availability to certification in each country; the documents do not mention Albania, so confirm with the distributor.

Sources:
- [BYD Battery-Box Premium HVS&HVM Compatible Inverter List V2.22](https://www.bydbatterybox.com/uploads/downloads/261010_BYD_Battery_Box_Premium_HVS&HVM_Compatible_Inverter_List_V2.22-6ac9d0a3b853b.pdf), 2026-10-10 (battery side)
- [Fronius Battery Storage Solution: BYD Battery-Box HVS/HVM, HVS+/HVM+ (EN V13)](https://www.fronius.com/~/downloads/Solar%20Energy/Solution%20Sheets/SE_SOLS_Batterystorage_byd_EN.pdf), 2026-05 (inverter side)

### Fronius Primo GEN24 5.0 Plus + Fronius Reserva 6.3
Listed by: same maker. Battery power (maker figure): 4.51 kW.

Fronius lists its own Reserva 6.3 with this inverter, at 4.51 kW of battery charge and discharge power.

Conditions:
- Fronius gives no minimum firmware version: the inverter and the battery must both run the latest software (the inverter updates through Solar.web).
- On the Primo GEN24 5.0 Plus only the Reserva 6.3 and 9.5 are allowed (the 9.5 gives 5.17 kW); the 12.6 needs the Plus SC version.
- Battery link: Modbus RTU (RS485) over a shielded 4-wire cable, CAT5 or better.
- A Fronius Smart Meter is required at the grid connection; a single-phase model suits the single-phase Primo.
- More storage: up to 4 Reserva towers in parallel, each with the same number of modules, with total output capped at 32 A.
- Backup when the grid fails: PV Point gives up to 3 kW single-phase; full backup needs extra switchover hardware, with rules that vary by country.
- Fronius ties availability to certification in each country; the documents do not mention Albania, so confirm with the distributor.

Sources:
- [Fronius Battery Storage Solution: Fronius Reserva (EN V10)](https://www.fronius.com/~/downloads/Solar%20Energy/Solution%20Sheets/SE_SOLS_Batterystorage_Fronius_Reserva_EN.pdf), 2025-12 (inverter+battery side)
- [Fronius compatible batteries](https://www.fronius.com/en/solar-energy/solar-solutions/solar-energy-storage/compatible-batteries), undated page (inverter side)
- [Fronius Reserva datasheet (EN V09)](https://www.fronius.com/~/downloads/Solar%20Energy/Datasheets/SE_DS_Fronius_Reserva_EN.pdf), 2026-09 (inverter+battery side)

### GoodWe GW10K-ET (ET PLUS+) + BYD HVS 10.2
Listed by: both makers.

Both makers list this pair, with inverter ARM firmware 11 or later.

Conditions:
- Inverter ARM firmware 11 or later (both makers require it); battery at least BMU 3.13 and BMS 3.19.
- Battery link: CAN, the inverter’s factory setting; RS485 needs a different cable.
- Only the Battery-Box Premium HVS: the newer HVS+ is not listed for this inverter.
- More storage: up to 3 towers in parallel, each with the same number of modules, never HVS mixed with HVM.
- GoodWe caps battery current at 25 A; at the HVS 10.2’s 409.6 V nominal that is about 10 kW, less when the battery is low. This is our estimate, not a maker figure.

Sources:
- [GoodWe Battery Compatibility Overview V029.1](https://en.goodwe.com/Ftp/EN/Downloads/User%20Manual/GW_Battery%20Compatibility%20Overview-EN.pdf), 2026-10-22 (inverter side)
- [BYD Battery-Box Premium HVS&HVM Compatible Inverter List V2.22](https://www.bydbatterybox.com/uploads/downloads/261010_BYD_Battery_Box_Premium_HVS&HVM_Compatible_Inverter_List_V2.22-6ac9d0a3b853b.pdf), 2026-10-10 (battery side)
- [GoodWe ET PLUS+ datasheet (EMEA, V1.1)](https://emea.goodwe.com/Ftp/Downloads/Datasheet/EMEA/GW_ET%20PLUS+_Datasheet_EMEA-EN.pdf), 2024-03-12 (inverter side)

### GoodWe GW10K-ET (ET PLUS+) + BYD HVM 11.0
Listed by: both makers.

Both makers list this pair, with inverter ARM firmware 11 or later. The HVM 11.0 is the smallest HVM allowed.

Conditions:
- Inverter ARM firmware 11 or later (both makers require it); battery at least BMU 3.13 and BMS 3.19.
- Battery link: CAN, the inverter’s factory setting; RS485 needs a different cable.
- The HVM 8.3 is not allowed, and the HVM+ is not listed for this inverter.
- More storage: up to 3 towers in parallel, each with the same number of modules, never HVS mixed with HVM.
- GoodWe caps battery current at 25 A; at the HVM 11.0’s 204.8 V nominal that is about 5.1 kW of battery power on a 10 kW inverter. This is our estimate, not a maker figure.
- The HVM 11.0 works from 160 V, below the inverter’s 180 V battery minimum; both makers still list the pair. Ask the installer whether this lowers the usable capacity.

Sources:
- [GoodWe Battery Compatibility Overview V029.1](https://en.goodwe.com/Ftp/EN/Downloads/User%20Manual/GW_Battery%20Compatibility%20Overview-EN.pdf), 2026-10-22 (inverter side)
- [BYD Battery-Box Premium HVS&HVM Compatible Inverter List V2.22](https://www.bydbatterybox.com/uploads/downloads/261010_BYD_Battery_Box_Premium_HVS&HVM_Compatible_Inverter_List_V2.22-6ac9d0a3b853b.pdf), 2026-10-10 (battery side)
- [GoodWe ET PLUS+ datasheet (EMEA, V1.1)](https://emea.goodwe.com/Ftp/Downloads/Datasheet/EMEA/GW_ET%20PLUS+_Datasheet_EMEA-EN.pdf), 2024-03-12 (inverter side)

### Huawei SUN2000-10KTL-M1 + Huawei LUNA2000-7-S1
Listed by: same maker. Battery power (maker figure): 3.5 kW.

Huawei lists its own LUNA2000-7-S1 with this inverter. With one battery module it works on-grid only (no backup when the grid fails) and gives at most 3.5 kW of battery power.

Conditions:
- Inverter firmware SUN2000MA V100R001C00SPC161 or later.
- On-grid only: backup when the grid fails needs at least two battery modules (with the 7 kWh modules, the LUNA2000-14-S1 or larger) and Huawei’s BackupBox-B1.
- One module caps battery charge and discharge at 3.5 kW on this 10 kW inverter.
- The time-of-use and maximum self-consumption modes need a power meter at the grid connection (or a Huawei SmartAssistant/SmartGuard): add it to the kit.
- S1 modules only: S0/E0 modules cannot be mixed with S1/E1.

Sources:
- [Huawei SUN2000-3/4/5/6/8/10KTL-M1 specs](https://solar.huawei.com/en/products/sun2000-3-4-5-6-8-10ktl-m1/specs/), undated page (inverter side)
- [Huawei LUNA2000-5/7/10/12/14/15/17/19/21-S1 datasheet (01-202509)](https://solar.huawei.com/dam/asset/view/36414e3c762a4e508d6fde579866c4c0.pdf), 2025-09 (battery side)
- [Huawei LUNA2000-S1 User Manual, Issue 06](https://solar.huawei.com/dam/asset/view/7fa828aede004fb1b1658929a49d6242.pdf), 2025-09-30 (battery side)
- [Huawei Digital Power Switzerland, LUNA2000-S1 guide (German)](https://solar.huawei.com/admin/asset/v1/pro/view/2e90d4e7704a401c8098ac6915beddfd.pdf), 2025-11-10 (inverter+battery side)

## Unknown pairs (never paired)
- **Fronius Symo GEN24 10.0 Plus + Huawei LUNA2000-7-S1**: Neither maker lists this pair and neither excludes it: it is not verified, so we never pair them ourselves. Huawei names only Huawei inverters for the LUNA2000-S1. Both maker researchers proposed "not compatible", but neither maker states an exclusion: Fronius says its inverters support other makers' storage "such as BYD or LG", and the voltage windows overlap. Sources: [Huawei LUNA2000-5/7/10/12/14/15/17/19/21-S1 datasheet (01-202509)](https://solar.huawei.com/dam/asset/view/36414e3c762a4e508d6fde579866c4c0.pdf), 2025-09 (battery side); [Fronius Symo GEN24 10.0 Plus: technical data](https://www.fronius.com/en/help-center/solar-energy/products/solar-inverters/gen24/symo-gen24-plus/fronius-symo-gen24-10-0-plus), undated page (inverter side); [Fronius compatible batteries](https://www.fronius.com/en/solar-energy/solar-solutions/solar-energy-storage/compatible-batteries), undated page (inverter side).
- **Fronius Primo GEN24 5.0 Plus + Huawei LUNA2000-7-S1**: Neither maker lists this pair and neither excludes it: it is not verified, so we never pair them ourselves. Huawei names only Huawei inverters for the LUNA2000-S1. Both maker researchers proposed "not compatible", but neither maker states an exclusion: Fronius says its inverters support other makers' storage "such as BYD or LG", and the voltage windows overlap. Sources: [Huawei LUNA2000-5/7/10/12/14/15/17/19/21-S1 datasheet (01-202509)](https://solar.huawei.com/dam/asset/view/36414e3c762a4e508d6fde579866c4c0.pdf), 2025-09 (battery side); [Fronius Primo GEN24 5.0 Plus: technical data](https://www.fronius.com/en/help-center/solar-energy/products/solar-inverters/gen24/primo-gen24-plus/fronius-primo-gen24-5-0-plus), undated page (inverter side).

## Not compatible
| Pair | Why | Sources |
|---|---|---|
| Deye SUN-10K-SG04LP3-EU + BYD HVS 10.2 | High-voltage battery on a 48 V inverter: the voltages cannot meet. Neither maker lists the pair. | [BYD Battery-Box Premium HVS&HVM Compatible Inverter List V2.22](https://www.bydbatterybox.com/uploads/downloads/261010_BYD_Battery_Box_Premium_HVS&HVM_Compatible_Inverter_List_V2.22-6ac9d0a3b853b.pdf)<br>[Deye Approved Battery list DY-LV48-0128](https://www.deyeinverter.com/deyeinverter/2026/09/07/DeyeApprovedBatterylistDY-LV48-0128.pdf)<br>[Deye SUN-5-12K-SG04LP3 datasheet](https://www.deyeinverter.com/deyeinverter/2024/10/21/datasheet_sun-5-12k-sg04lp3_241021_en.pdf) |
| Deye SUN-10K-SG04LP3-EU + BYD HVM 11.0 | High-voltage battery on a 48 V inverter: the voltages cannot meet. Neither maker lists the pair. | [BYD Battery-Box Premium HVS&HVM Compatible Inverter List V2.22](https://www.bydbatterybox.com/uploads/downloads/261010_BYD_Battery_Box_Premium_HVS&HVM_Compatible_Inverter_List_V2.22-6ac9d0a3b853b.pdf)<br>[Deye Approved Battery list DY-LV48-0128](https://www.deyeinverter.com/deyeinverter/2026/09/07/DeyeApprovedBatterylistDY-LV48-0128.pdf) |
| Deye SUN-10K-SG04LP3-EU + Fronius Reserva 6.3 | High-voltage battery on a 48 V inverter, and Fronius lists the Reserva only with Fronius inverters. | [Fronius Reserva product page](https://www.fronius.com/en/solar-energy/solar-solutions/solar-energy-storage/reserva)<br>[Deye SUN-5-12K-SG04LP3 datasheet](https://www.deyeinverter.com/deyeinverter/2024/10/21/datasheet_sun-5-12k-sg04lp3_241021_en.pdf) |
| Deye SUN-10K-SG04LP3-EU + Huawei LUNA2000-7-S1 | Huawei names only Huawei inverters for the LUNA2000-S1, and its high voltage cannot meet a 48 V inverter. | [Huawei LUNA2000-5/7/10/12/14/15/17/19/21-S1 datasheet (01-202509)](https://solar.huawei.com/dam/asset/view/36414e3c762a4e508d6fde579866c4c0.pdf)<br>[Deye SUN-5-12K-SG04LP3 datasheet](https://www.deyeinverter.com/deyeinverter/2024/10/21/datasheet_sun-5-12k-sg04lp3_241021_en.pdf) |
| Fronius Symo GEN24 10.0 Plus + Dyness PowerBox G3 | 48 V battery on a high-voltage inverter: the voltages cannot meet. Neither maker lists the pair. | [Fronius Symo GEN24 10.0 Plus: technical data](https://www.fronius.com/en/help-center/solar-energy/products/solar-inverters/gen24/symo-gen24-plus/fronius-symo-gen24-10-0-plus)<br>[Dyness Powerbox G3 User Manual V4.0](https://www.dyness.com/Public/Uploads/uploadfile/files/20260920/PowerboxG3UserManualEN20260918.pdf) |
| Fronius Symo GEN24 10.0 Plus + Pylontech US5000 | 48 V battery on a high-voltage inverter: the voltages cannot meet. Neither maker lists the pair. | [Fronius Symo GEN24 10.0 Plus: technical data](https://www.fronius.com/en/help-center/solar-energy/products/solar-inverters/gen24/symo-gen24-plus/fronius-symo-gen24-10-0-plus)<br>[Pylontech US5000 Installation Manual V1.0](https://en.pylontech.com.cn/profile/upload/2024/09/25/RESS-Installation%20Manual-US5000%20US5000-B%205PMPA08-00219_V1.0_20240925124144A058.pdf) |
| Fronius Primo GEN24 5.0 Plus + BYD HVS 10.2 | Fronius excludes the HVS 10.2 on the Primo GEN24 5.0 Plus: its voltage goes up to 480 V, above the Primo’s 455 V battery limit. On the Primo use the HVM 11.0 or the Reserva 6.3. | [Fronius Battery Storage Solution: BYD Battery-Box HVS/HVM, HVS+/HVM+ (EN V13)](https://www.fronius.com/~/downloads/Solar%20Energy/Solution%20Sheets/SE_SOLS_Batterystorage_byd_EN.pdf)<br>[BYD Battery-Box Premium HVS&HVM Compatible Inverter List V2.22](https://www.bydbatterybox.com/uploads/downloads/261010_BYD_Battery_Box_Premium_HVS&HVM_Compatible_Inverter_List_V2.22-6ac9d0a3b853b.pdf) |
| Fronius Primo GEN24 5.0 Plus + Dyness PowerBox G3 | 48 V battery on a high-voltage inverter: the voltages cannot meet. Neither maker lists the pair. | [Fronius Primo GEN24 5.0 Plus: technical data](https://www.fronius.com/en/help-center/solar-energy/products/solar-inverters/gen24/primo-gen24-plus/fronius-primo-gen24-5-0-plus)<br>[Dyness Powerbox G3 User Manual V4.0](https://www.dyness.com/Public/Uploads/uploadfile/files/20260920/PowerboxG3UserManualEN20260918.pdf) |
| Fronius Primo GEN24 5.0 Plus + Pylontech US5000 | 48 V battery on a high-voltage inverter: the voltages cannot meet. Neither maker lists the pair. | [Fronius Primo GEN24 5.0 Plus: technical data](https://www.fronius.com/en/help-center/solar-energy/products/solar-inverters/gen24/primo-gen24-plus/fronius-primo-gen24-5-0-plus)<br>[Pylontech US5000 Installation Manual V1.0](https://en.pylontech.com.cn/profile/upload/2024/09/25/RESS-Installation%20Manual-US5000%20US5000-B%205PMPA08-00219_V1.0_20240925124144A058.pdf) |
| GoodWe GW10K-ET (ET PLUS+) + Dyness PowerBox G3 | GoodWe approves only the batteries on its own list, and the PowerBox G3 is not on it; it is also a 48 V battery on a high-voltage inverter. | [GoodWe Battery Compatibility Overview V029.1](https://en.goodwe.com/Ftp/EN/Downloads/User%20Manual/GW_Battery%20Compatibility%20Overview-EN.pdf)<br>[List of the Inverter Brands Compatible with Dyness Low-voltage Batteries](https://www.dyness.com/Public/Uploads/uploadfile/files/20260727/DynessLowvoltageBatteriesCampatibilityList20260715.pdf) |
| GoodWe GW10K-ET (ET PLUS+) + Fronius Reserva 6.3 | GoodWe approves only the batteries on its own list, which has no Fronius battery; Fronius lists the Reserva only with Fronius inverters. | [GoodWe Battery Compatibility Overview V029.1](https://en.goodwe.com/Ftp/EN/Downloads/User%20Manual/GW_Battery%20Compatibility%20Overview-EN.pdf)<br>[Fronius Reserva product page](https://www.fronius.com/en/solar-energy/solar-solutions/solar-energy-storage/reserva) |
| GoodWe GW10K-ET (ET PLUS+) + Huawei LUNA2000-7-S1 | GoodWe’s list has no Huawei battery, and Huawei names only Huawei inverters for the LUNA2000-S1. | [GoodWe Battery Compatibility Overview V029.1](https://en.goodwe.com/Ftp/EN/Downloads/User%20Manual/GW_Battery%20Compatibility%20Overview-EN.pdf)<br>[Huawei LUNA2000-5/7/10/12/14/15/17/19/21-S1 datasheet (01-202509)](https://solar.huawei.com/dam/asset/view/36414e3c762a4e508d6fde579866c4c0.pdf) |
| GoodWe GW10K-ET (ET PLUS+) + Pylontech US5000 | GoodWe lists the US5000 only for its 48 V inverters (ES G2, SBP G2), not for the ET; it is a 48 V battery on a high-voltage inverter. | [GoodWe Battery Compatibility Overview V029.1](https://en.goodwe.com/Ftp/EN/Downloads/User%20Manual/GW_Battery%20Compatibility%20Overview-EN.pdf)<br>[GoodWe ET PLUS+ datasheet (EMEA, V1.1)](https://emea.goodwe.com/Ftp/Downloads/Datasheet/EMEA/GW_ET%20PLUS+_Datasheet_EMEA-EN.pdf) |
| Growatt MOD 10KTL3-XH + BYD HVS 10.2 | Growatt allows only its own ARK-XH HV battery on this inverter (“only” in its manual). The HVS 10.2 (up to 480 V) is also below its 600–950 V battery input. | [Growatt MOD 3-10KTL3-XH User Manual](https://en.growatt.com/upload/file/MOD_3-10KTL3-XH_User_Manual_EN_202405.pdf)<br>[BYD Battery-Box Premium HVS&HVM Compatible Inverter List V2.22](https://www.bydbatterybox.com/uploads/downloads/261010_BYD_Battery_Box_Premium_HVS&HVM_Compatible_Inverter_List_V2.22-6ac9d0a3b853b.pdf) |
| Growatt MOD 10KTL3-XH + BYD HVM 11.0 | Growatt allows only its own ARK-XH HV battery on this inverter (“only” in its manual). The HVM 11.0 is also far below its 600–950 V battery input. | [Growatt MOD 3-10KTL3-XH User Manual](https://en.growatt.com/upload/file/MOD_3-10KTL3-XH_User_Manual_EN_202405.pdf) |
| Growatt MOD 10KTL3-XH + Dyness PowerBox G3 | Growatt allows only its own ARK-XH HV battery on this inverter (“only” in its manual). A 48 V battery cannot meet its 600–950 V battery input either. | [Growatt MOD 3-10KTL3-XH User Manual](https://en.growatt.com/upload/file/MOD_3-10KTL3-XH_User_Manual_EN_202405.pdf)<br>[List of the Inverter Brands Compatible with Dyness Low-voltage Batteries](https://www.dyness.com/Public/Uploads/uploadfile/files/20260727/DynessLowvoltageBatteriesCampatibilityList20260715.pdf) |
| Growatt MOD 10KTL3-XH + Fronius Reserva 6.3 | Growatt allows only its own ARK-XH HV battery on this inverter (“only” in its manual). Fronius also lists the Reserva only with Fronius inverters. | [Growatt MOD 3-10KTL3-XH User Manual](https://en.growatt.com/upload/file/MOD_3-10KTL3-XH_User_Manual_EN_202405.pdf)<br>[Fronius Battery Storage Solution: Fronius Reserva (EN V10)](https://www.fronius.com/~/downloads/Solar%20Energy/Solution%20Sheets/SE_SOLS_Batterystorage_Fronius_Reserva_EN.pdf) |
| Growatt MOD 10KTL3-XH + Huawei LUNA2000-7-S1 | Growatt allows only its own ARK-XH HV battery on this inverter (“only” in its manual). The voltages overlap, but Growatt’s “only” rules it out, and Huawei names only Huawei inverters for the LUNA2000-S1. | [Growatt MOD 3-10KTL3-XH User Manual](https://en.growatt.com/upload/file/MOD_3-10KTL3-XH_User_Manual_EN_202405.pdf)<br>[Huawei LUNA2000-5/7/10/12/14/15/17/19/21-S1 datasheet (01-202509)](https://solar.huawei.com/dam/asset/view/36414e3c762a4e508d6fde579866c4c0.pdf) |
| Growatt MOD 10KTL3-XH + Pylontech US5000 | Growatt allows only its own ARK-XH HV battery on this inverter (“only” in its manual). A 48 V battery cannot meet its 600–950 V battery input either. | [Growatt MOD 3-10KTL3-XH User Manual](https://en.growatt.com/upload/file/MOD_3-10KTL3-XH_User_Manual_EN_202405.pdf)<br>[Compatibility List of Pylontech Low Voltage ESS and Inverters Ver.2.46](https://en.pylontech.com.cn/profile/upload/2026/07/17/Compatibility%20List%20of%20Pylontech%20Low%20Voltage%20ESS%20and%20Inverters%20Ver.2.46_1784254097873.pdf) |
| Huawei SUN2000-10KTL-M1 + BYD HVS 10.2 | Huawei allows only its own LUNA2000-S0 and S1 batteries on the M1. The HVS 10.2 (up to 480 V) is also below its 600–980 V battery input. | [Huawei SUN2000-3/4/5/6/8/10KTL-M1 specs](https://solar.huawei.com/en/products/sun2000-3-4-5-6-8-10ktl-m1/specs/) |
| Huawei SUN2000-10KTL-M1 + BYD HVM 11.0 | Huawei allows only its own LUNA2000-S0 and S1 batteries on the M1. The HVM 11.0 is also far below its 600–980 V battery input. | [Huawei SUN2000-3/4/5/6/8/10KTL-M1 specs](https://solar.huawei.com/en/products/sun2000-3-4-5-6-8-10ktl-m1/specs/) |
| Huawei SUN2000-10KTL-M1 + Dyness PowerBox G3 | Huawei allows only its own LUNA2000-S0 and S1 batteries on the M1. A 48 V battery cannot meet its 600–980 V battery input either. | [Huawei SUN2000-3/4/5/6/8/10KTL-M1 specs](https://solar.huawei.com/en/products/sun2000-3-4-5-6-8-10ktl-m1/specs/) |
| Huawei SUN2000-10KTL-M1 + Fronius Reserva 6.3 | Huawei allows only its own LUNA2000-S0 and S1 batteries on the M1. Fronius also lists the Reserva only with Fronius inverters. | [Huawei SUN2000-3/4/5/6/8/10KTL-M1 specs](https://solar.huawei.com/en/products/sun2000-3-4-5-6-8-10ktl-m1/specs/)<br>[Fronius Reserva product page](https://www.fronius.com/en/solar-energy/solar-solutions/solar-energy-storage/reserva) |
| Huawei SUN2000-10KTL-M1 + Pylontech US5000 | Huawei allows only its own LUNA2000-S0 and S1 batteries on the M1. A 48 V battery cannot meet its 600–980 V battery input either. | [Huawei SUN2000-3/4/5/6/8/10KTL-M1 specs](https://solar.huawei.com/en/products/sun2000-3-4-5-6-8-10ktl-m1/specs/)<br>[Pylontech US5000 Installation Manual V1.0](https://en.pylontech.com.cn/profile/upload/2024/09/25/RESS-Installation%20Manual-US5000%20US5000-B%205PMPA08-00219_V1.0_20240925124144A058.pdf) |

## Catalogue gaps (shown on the product pages, `CATALOGUE_NOTES`)
- `growatt-mod-10ktl3-xh`: Growatt allows only its own ARK-XH HV battery on this inverter (the BP version: only the APX HV). Neither is in the catalogue, so no battery in the catalogue works with it. ([Growatt MOD 3-10KTL3-XH User Manual](https://en.growatt.com/upload/file/MOD_3-10KTL3-XH_User_Manual_EN_202405.pdf))
- `huawei-luna2000-7-s1`: With the Huawei SUN2000-10KTL-M1, the LUNA2000-7-S1 (one battery module) works on-grid only: backup when the grid fails needs at least two modules, so the LUNA2000-14-S1 or larger with the 7 kWh modules. ([Huawei LUNA2000-S1 User Manual, Issue 06](https://solar.huawei.com/dam/asset/view/7fa828aede004fb1b1658929a49d6242.pdf))
- `huawei-sun2000-10ktl-m1`: Huawei allows only its own LUNA2000-S0 and S1 batteries on this inverter. With the LUNA2000-7-S1 in the catalogue it works on-grid only, with no backup when the grid fails. ([Huawei SUN2000-3/4/5/6/8/10KTL-M1 specs](https://solar.huawei.com/en/products/sun2000-3-4-5-6-8-10ktl-m1/specs/), [Huawei LUNA2000-S1 User Manual, Issue 06](https://solar.huawei.com/dam/asset/view/7fa828aede004fb1b1658929a49d6242.pdf))
- `deye-sun-10k-sg04lp3-eu`: On Deye’s site this model has been replaced by the SUN-10K-SG05LP3-EU-SM2, but the SG04LP3-EU is still named on the Deye, Dyness and Pylontech battery lists. ([Deye Approved Battery list DY-LV48-0128](https://www.deyeinverter.com/deyeinverter/2026/09/07/DeyeApprovedBatterylistDY-LV48-0128.pdf), [List of the Inverter Brands Compatible with Dyness Low-voltage Batteries](https://www.dyness.com/Public/Uploads/uploadfile/files/20260727/DynessLowvoltageBatteriesCampatibilityList20260715.pdf), [Compatibility List of Pylontech Low Voltage ESS and Inverters Ver.2.46](https://en.pylontech.com.cn/profile/upload/2026/07/17/Compatibility%20List%20of%20Pylontech%20Low%20Voltage%20ESS%20and%20Inverters%20Ver.2.46_1784254097873.pdf))
- `byd-battery-box-premium-hvs-10-2`: Not for the Fronius Primo GEN24 5.0 Plus: Fronius excludes the HVS 10.2 on the Primo (only the HVS 5.1 and 7.7 are allowed there, and they are not in the catalogue). With the Fronius Symo GEN24 10.0 Plus and the GoodWe GW10K-ET it is listed. ([Fronius Battery Storage Solution: BYD Battery-Box HVS/HVM, HVS+/HVM+ (EN V13)](https://www.fronius.com/~/downloads/Solar%20Energy/Solution%20Sheets/SE_SOLS_Batterystorage_byd_EN.pdf), [BYD Battery-Box Premium HVS&HVM Compatible Inverter List V2.22](https://www.bydbatterybox.com/uploads/downloads/261010_BYD_Battery_Box_Premium_HVS&HVM_Compatible_Inverter_List_V2.22-6ac9d0a3b853b.pdf))
- `fronius-primo-gen24-5-plus`: Fronius excludes the BYD HVS 10.2 on this inverter; of the catalogue’s batteries, the BYD HVM 11.0 and the Fronius Reserva 6.3 work with it. ([Fronius Battery Storage Solution: BYD Battery-Box HVS/HVM, HVS+/HVM+ (EN V13)](https://www.fronius.com/~/downloads/Solar%20Energy/Solution%20Sheets/SE_SOLS_Batterystorage_byd_EN.pdf), [Fronius Battery Storage Solution: Fronius Reserva (EN V10)](https://www.fronius.com/~/downloads/Solar%20Energy/Solution%20Sheets/SE_SOLS_Batterystorage_Fronius_Reserva_EN.pdf))

## Doubts and what the skeptics corrected
- **Deye + Dyness PowerBox G3 rests on the battery maker alone.** Every cell of the Dyness low-voltage list is ticked (113 rows × 13 battery columns), so it is a brand-level matrix, not a per-pair test. It does name this inverter family and this battery. Deye's own list names only the older Dyness B4850/A48100 and tells buyers to confirm with the battery maker. Neither maker publishes Deye's Lithium-mode number for the G3.
- **Deye's product page for the SG04LP3-EU returns 404**: Deye replaced it with the SG05LP3-EU-SM2. All three lists (Deye DY-LV48-0128, Dyness, Pylontech) still name the SG04LP3-EU.
- **Pylontech US5000, modules per group:** the installation manual says 16; Pylontech's 2026 spec PDF says 20 (research/products-pv.md). Check before quoting a large bank. The current figures (80 A recommended, 100 A continuous) are from the installation manual.
- **A single battery module limits the 10 kW low-voltage Deye** (210 A battery input): one US5000 gives up to 100 A continuous, one G3 200 A. The packages and the calculator size the battery by capacity (0.6–1.8 × kWp × batteryKwhPerKwp), so a kit can contain one module; the pair's conditions say so.
- **GoodWe battery power is our estimate** (25 A × nominal voltage: about 10 kW with the HVS 10.2, about 5.1 kW with the HVM 11.0, less at low charge). The HVM 11.0 works from 160 V, below the ET's 180 V battery minimum; both makers still list the pair.
- **Fronius availability in Albania:** Fronius ties battery support to country certification and availability; no document names Albania. Confirm with the distributor.
- **Fronius BYD sheet (EN V13) has one internal error:** on page 4 the HVM column repeats the HVS line "One tower scalable up to 7.68 kWh (Primo…)"; its page-3 table and its parallel figure contradict it. The page-3 table is what the code uses.
- **Huawei M1 + 7-S1:** a skeptic corrected "backup needs the 14-S1 or larger": the 10-S1 (5 + 5) and 12-S1 (5 + 7) also have two modules; with the 7 kWh modules in the catalogue the 14-S1 is the smallest two-module option. The claimed condition "RS485 baud rate must be 9600" was not supported by the manual (it applies only to a battery moved from an MB0, LC0 or MAP0 inverter) and was dropped.
- **Growatt MOD 10KTL3-XH has no battery in the catalogue:** Growatt's manual says "Compatible battery (only) ARK-XH HV Battery" (BP variant: "APX HV Battery (only)"). To sell Growatt battery kits, the catalogue needs the ARK-XH (with its BDC) or the APX HV.
