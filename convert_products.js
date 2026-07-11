const fs = require('fs');

const rawProducts = [
  // Condor
  { brand: "Condor", category: "MAL", reference: "WT10T1", designation: "MAL CONDOR Semi- Auto 10.5 kg Tulipe", priceHT: 445.000 },
  { brand: "Condor", category: "MAL", reference: "WT10T1BF", designation: "MAL CONDOR Semi- Auto 10.5 kg Tulipe Bleu", priceHT: 445.000 },
  { brand: "Condor", category: "MAL", reference: "WT13T1", designation: "MAL CONDOR Semi-Auto 13 kg Tulipe", priceHT: 510.000 },
  { brand: "Condor", category: "MAL", reference: "WT13T1BF", designation: "MAL CONDOR Semi-Auto 13 kg Tulipe Bleu", priceHT: 510.000 },
  { brand: "Condor", category: "MAL", reference: "WAT-KS3M34W", designation: "MAL Condor TOP 8kg Blanche", priceHT: 675.000 },
  { brand: "Condor", category: "MAL", reference: "WAT-KS3M34D", designation: "MAL Condor TOP 8kg GRIS", priceHT: 705.000 },
  { brand: "Condor", category: "MAL", reference: "WL10-MS35W", designation: "MALCondor Top 10,5 kg BL", priceHT: 870.000 },
  { brand: "Condor", category: "MAL", reference: "WL10-MS35D", designation: "Mal Condor Top 10,5 kg Dark Silver", priceHT: 915.000 },
  { brand: "Condor", category: "MAL", reference: "WF6-A12W", designation: "MAL Condor 6Kg/1200 Trs BLANC", priceHT: 840.000 },
  { brand: "Condor", category: "MAL", reference: "CON-F610LS", designation: "MAL Condor 6Kg/1000 Trs SILVER", priceHT: 895.000 },
  { brand: "Condor", category: "MAL", reference: "CON-F610LB", designation: "MAL Condor 6Kg/1000 Trs Noir", priceHT: 895.000 },
  { brand: "Condor", category: "MAL", reference: "CON-F710L", designation: "MAL Condor 7Kg/1000 Trs SILVER", priceHT: 900.000 },
  { brand: "Condor", category: "MAL", reference: "CON-F710LS", designation: "MAL Condor 7Kg/1000 Trs SILVER", priceHT: 955.000 },
  { brand: "Condor", category: "MAL", reference: "CON-F710LB", designation: "MAL Condor 7Kg/1000 Trs noir", priceHT: 955.000 },
  { brand: "Condor", category: "MAL", reference: "WAF-KU241L3W", designation: "MAL CONDOR 8KG 1200 trs BLANC", priceHT: 1085.000 },
  { brand: "Condor", category: "MAL", reference: "CON-F812DS", designation: "MAL Condor 8KG 1200 trs BLACK", priceHT: 1135.000 },
  { brand: "Condor", category: "MAL", reference: "CON-F812DB", designation: "MAL Condor 8KG 1200 trs BLACK", priceHT: 1160.000 },
  { brand: "Condor", category: "MAL", reference: "CON-F912D", designation: "MAL CONDOR FRONTAL 9KG 1200 TR/BL", priceHT: 1140.000 },
  { brand: "Condor", category: "MAL", reference: "CON-F9121B", designation: "MAL Condor 9KG 1200 trs Noir", priceHT: 1260.000 },
  { brand: "Condor", category: "MAL", reference: "CON-F912DS", designation: "MAL Condor 9KG 120 ORPM Dark SILVER", priceHT: 1200.000 },
  { brand: "Condor", category: "MAL", reference: "CON-FM121B", designation: "MAL Condor 10,5 KG 1200 trs Noir", priceHT: 1470.000 },
  { brand: "Condor", category: "MAL", reference: "WAF-XLB441L1T", designation: "MAL CONDOR Luna 10.5 Kg Inverter/1400 Trs Titanium", priceHT: 1450.000 },
  { brand: "Condor", category: "LAVE VAISSELLE", reference: "CLV-LUX16X", designation: "LV Condor 16 couverts inverter Aff Inox", priceHT: 1470.000 },
  { brand: "Condor", category: "LAVE VAISSELLE", reference: "CLV-LUX16XB", designation: "LV Condor 16 couverts inverter Aff Noir", priceHT: 1525.000 },
  { brand: "Condor", category: "REF", reference: "CRF-T5GM8", designation: "MINI BAR CONDOR 45L", priceHT: 375.000 },
  { brand: "Condor", category: "REF", reference: "CRF-T24GD14R", designation: "REF CONDOR Rouge AVEC DISTRIBUTEUR D'EAU / R601a", priceHT: 710.000 },
  { brand: "Condor", category: "REF", reference: "CRD45V4W-S", designation: "REF Condor DF 345L Blanc avec serrure", priceHT: 1095.000 },
  { brand: "Condor", category: "REF", reference: "CRD45V4G-S", designation: "REF Condor DF 345LGRIS avec serrure", priceHT: 1180.000 },
  { brand: "Condor", category: "REF", reference: "CRD45V4X-S", designation: "REF Condor DF 345LINOX avec serrure", priceHT: 1200.000 },
  { brand: "Condor", category: "REF", reference: "CRDN560-W", designation: "REFRIGERATEUR 2P NO-FROST 415L Blanc", priceHT: 1580.000 },
  { brand: "Condor", category: "REF", reference: "CRDN630W", designation: "REFRIGERATEUR 2P NO-FROST 470L Blanc", priceHT: 1710.000 },
  { brand: "Condor", category: "REF", reference: "CRS81NDX", designation: "SBS NF Condor 640 L Aff/ Dark Inox", priceHT: 2740.000 },
  { brand: "Condor", category: "CLIM", reference: "CS12-AL84T3", designation: "Clim Condor 12KBTU SUPER TROPICAL ALPHA", priceHT: 1540.000 },
  { brand: "Condor", category: "ENCASTRABLE", reference: "CTE64WAS1X", designation: "Table de cuiss condor 4Feux Fonte INOX", priceHT: 304.000 },
  { brand: "Condor", category: "ENCASTRABLE", reference: "CTE75W-FL2X", designation: "Table de cuiss condor encast 5Feux-WOK Fonte /INOX", priceHT: 552.000 },
  { brand: "Condor", category: "ENCASTRABLE", reference: "CH-Q6300X", designation: "Hotte condor casquette 60cm/320m3/h/inox", priceHT: 185.000 },
  { brand: "Condor", category: "ENCASTRABLE", reference: "CH-Q6300N", designation: "Hotte condor casquette 60cm/320 m3/h/noire", priceHT: 185.000 },
  { brand: "Condor", category: "ENCASTRABLE", reference: "CH-A640XGB", designation: "Hotte condor murale décorative 60cm Miroir/Noir", priceHT: 365.000 },
  { brand: "Condor", category: "ENCASTRABLE", reference: "CH-L640X", designation: "Hotte condor cheminée 60cm/450m3/h INOX", priceHT: 415.000 },
  { brand: "Condor", category: "PEM", reference: "RC-MM1SN", designation: "ROBOT DE CUISINE CONDOR MUIti F MASTER MIX 750W", priceHT: 230.000 },
  { brand: "Condor", category: "PEM", reference: "RC-MV1SN", designation: "ROBOT DE CUISINE CONDOR MULTI FONCTION Versa Ch", priceHT: 345.000 },
  { brand: "Condor", category: "PEM", reference: "RC-MU1SN", designation: "ROBOT DE CUISINE CONDOR Mono F MASTER MIX 750W", priceHT: 195.000 },
  { brand: "Condor", category: "PEM", reference: "BT-MH2XN", designation: "BATTEUR MAIN CONDOR MASTER MIX 400W/INOX-NOIR", priceHT: 62.000 },

  // Hisense
  { brand: "Hisense", category: "REF", reference: "RB1N300NMC/(RD39)", designation: "Ref NF Combiné Hisense 320 Litres Silver AFF/FONT", priceHT: 1815.000 },
  { brand: "Hisense", category: "REF", reference: "RB1N300NMF1", designation: "Ref NF Combiné Hisense 320 Litres NOIR AFF/FONT", priceHT: 1840.000 },
  { brand: "Hisense", category: "REF", reference: "RT-60W", designation: "Ref NF Hisense 470 L premium inox Aff/Fontaine", priceHT: 2020.000 },
  { brand: "Hisense", category: "REF", reference: "RS3P518NMC/(RC67)", designation: "Ref NF SBS INOX SILVER Hisense 518 L", priceHT: 3050.000 },
  { brand: "Hisense", category: "REF", reference: "RS5P668NMC/ RC 87)", designation: "Réf SBS Hisense 640 L Font/Aff Inox Silver", priceHT: 3680.000 },
  { brand: "Hisense", category: "CONG", reference: "FC-33DT4SAW", designation: "Congélateur horizontal hisense convertible blanc 238L", priceHT: 970.000 },
  { brand: "Hisense", category: "CONG", reference: "FC-40DT4SAW1", designation: "Congélateur horizontal hisense convertible blanc 286 L", priceHT: 1020.000 },
  { brand: "Hisense", category: "CONG", reference: "FC-39DD", designation: "Congélateur horizontal HISENSE 297 Litres Blanc", priceHT: 1170.000 },
  { brand: "Hisense", category: "MAL", reference: "WT3K1423UT", designation: "MAL Top Hisense 14 kg/Titanium Silver", priceHT: 1550.000 },
  { brand: "Hisense", category: "MAL", reference: "WT311823UB", designation: "MAL Top Hisense 18 kg/dark silver", priceHT: 1660.000 },
  { brand: "Hisense", category: "MAL", reference: "WFQP8014EVMT", designation: "Mal Frontale Hisense 8Kg/1400 Trs Inverter STEAM Titanium Silver", priceHT: 1200.000 },
  { brand: "Hisense", category: "MAL", reference: "WF3S1043BW", designation: "MAL HISENSE 10.5 KG SMART INVERTER BLANC", priceHT: 1440.000 },
  { brand: "Hisense", category: "MAL", reference: "WF3S1243BT", designation: "MAL Hisense 12 Kg Smart Inverter Vapeur Titanium", priceHT: 1620.000 },
  { brand: "Hisense", category: "TV", reference: "43A4200G", designation: "TV HISENSE 43\" SMART UHD ANDROID", priceHT: 828.000 },
  { brand: "Hisense", category: "TV", reference: "50A6GN", designation: "TV HISENSE 50\" SMART UHD 4K GOOGLE TV", priceHT: 1190.000 },
  { brand: "Hisense", category: "TV", reference: "S5A6500N", designation: "TV Hisense 55\" 4K UHD A6500N Series GOOGLE TV", priceHT: 1340.000 },
  { brand: "Hisense", category: "TV", reference: "65A6500N", designation: "TV Hisense 65\" 4K UHD A6500N Series GOOGLE TV", priceHT: 2215.000 },
  { brand: "Hisense", category: "TV", reference: "75A6500N", designation: "TV Hisense 75\" 4K UHD A6500N Series GOOGLE TV", priceHT: 3600.000 },
  { brand: "Hisense", category: "TV", reference: "85A6N +43A4200G", designation: "TV HISENSE 85\" SMART UHD 4K", priceHT: 5920.000 },
  { brand: "Hisense", category: "TV", reference: "85Q6N +43A4200G", designation: "TV HISENSE 85\" QLED UHD 4K Smart TV", priceHT: 6120.000 },
  { brand: "Hisense", category: "TV", reference: "100Q7N+50A6GN", designation: "TV HISENSE QLED UHD 100\" /SERIE Q7", priceHT: 9240.000 },
  { brand: "Hisense", category: "TV", reference: "100L5GE", designation: "TV HISENSE 100\" 4K UHD SMART TV X-Fusion Laser Light", priceHT: 13200.000 },
  { brand: "Hisense", category: "CLIM", reference: "AS-12UW4S", designation: "CLIMATISEUR HISENSE 12000 CF INVERTER", priceHT: 1610.000 },
  { brand: "Hisense", category: "CLIM", reference: "AS-24HW4S", designation: "CLIMATISEUR HISENSE 24000 CFON/OFF", priceHT: 2440.000 },
  { brand: "Hisense", category: "CLIM", reference: "AS-24UW4S", designation: "CLIMATISEUR HISENSE 24000 CFinverter", priceHT: 2640.000 },
  { brand: "Hisense", category: "MICRO ONDE", reference: "H20MOMP1HG", designation: "Four Mico-ondes Hisense 20 L/700W silver", priceHT: 294.000 },
  { brand: "Hisense", category: "MICRO ONDE", reference: "H20MOWS11", designation: "Mico-ondes Hisense 20 L/700W blanc contrôle digital", priceHT: 305.000 },
  { brand: "Hisense", category: "MICRO ONDE", reference: "H25MOWS7H", designation: "Mico-ondes Hisense 25 L/900W blanc contrôle digital", priceHT: 405.000 },
  { brand: "Hisense", category: "MICRO ONDE", reference: "H25MOBS6G", designation: "Four/Mico-ondes Hisense 25 L/900W noir contrôle digital", priceHT: 385.000 },
  { brand: "Hisense", category: "PEM", reference: "VC2302GALRCY", designation: "Aspirateur Hisense sans sac 2300W ROUGE", priceHT: 330.000 },
  { brand: "Hisense", category: "PEM", reference: "H06AFBS2S3", designation: "Air Fryer Hisense 6,7 L/1350W/Digital", priceHT: 250.000 },
  { brand: "Hisense", category: "PEM", reference: "H15TBWESZA", designation: "Blender Hisense 1,5 L BL/Inox 500 W", priceHT: 107.000 },

  // TCL
  { brand: "TCL", category: "REF", reference: "P333 TMS", priceHT: 1750.000, characteristics: "Double portes, Capacité nette (L) : 333" },
  { brand: "TCL", category: "REF", reference: "P425 TMN", priceHT: 2225.000, characteristics: "Double portes, Capacité nette (L) : 420" },
  { brand: "TCL", category: "REF", reference: "P465 TMN", priceHT: 2300.000, characteristics: "Double portes, Capacité nette (L) : 465" },
  { brand: "TCL", category: "REF", reference: "P545 TMN", priceHT: 2680.000, characteristics: "Double portes, Capacité nette (L) : 540" },
  { brand: "TCL", category: "REF", reference: "P315 BFN", priceHT: 1950.000, characteristics: "Combiné, Capacité nette (L) : 318" },
  { brand: "TCL", category: "REF", reference: "C512 CDN", priceHT: 4900.000, characteristics: "Quatre Portes, Capacité nette (L) : 512 L" },
  { brand: "TCL", category: "REF", reference: "P370", priceHT: 1720.000, characteristics: "Double portes, Capacité nette (L):286" },
  { brand: "TCL", category: "REF", reference: "P417 BFN", priceHT: 2575.000, characteristics: "Combiné, Capacité nette (L):417" }
];

const imgMap = {
  "MAL": "washer.png",
  "LAVE VAISSELLE": "washer.png",
  "REF": "fridge.png",
  "CONG": "fridge.png",
  "CLIM": "ac.png",
  "ENCASTRABLE": "oven.png",
  "PEM": "blender.png",
  "TV": "tv.png",
  "MICRO ONDE": "microwave.png"
};

const processed = rawProducts.map((p, index) => {
  const isNew = Math.random() > 0.7; // ~30% are new
  const isDiscount = Math.random() > 0.7; // ~30% have discount
  
  const price = p.priceHT * 1.19; // Add fake VAT or just use priceHT as base
  let discPrice = undefined;
  if(isDiscount) {
    discPrice = price * 0.9;
  }
  
  return {
    id: index + 1,
    name: p.designation,
    category: p.category,
    price: price,
    discountPrice: discPrice,
    img: imgMap[p.category] || "default.png",
    isNew: isNew,
    desc: p.characteristics || \`\${p.brand} \${p.category} - \${p.reference}. Un excellent choix pour votre maison.\`,
    specs: {
      "Marque": p.brand,
      "Référence": p.reference
    }
  };
});

const fileContent = fs.readFileSync('index.html', 'utf8');
const startMatch = "const products = [";
const endMatch = "];\n\nlet cart = [];";

const startIndex = fileContent.indexOf(startMatch);
const endIndex = fileContent.indexOf(endMatch);

if (startIndex !== -1 && endIndex !== -1) {
  const newProductsStr = "const products = " + JSON.stringify(processed, null, 2) + ";\n\nlet cart = [];";
  const newFileContent = fileContent.substring(0, startIndex) + newProductsStr + fileContent.substring(endIndex + endMatch.length);
  fs.writeFileSync('index.html', newFileContent);
  console.log("Successfully updated products!");
} else {
  console.log("Could not find product array boundaries.");
}
