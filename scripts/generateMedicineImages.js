import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MEDICINE_CATALOG } from '../src/data/medicineCatalog.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outDir = path.join(__dirname, '..', 'public', 'images', 'medicines');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Color palettes and brand traits for popular Indian medicines
const BRAND_STYLES = {
  // Pain & Fever
  'med-dolo650': { type: 'blister', primary: '#15803d', secondary: '#86efac', pillColor: '#ffffff', pillShape: 'round', pillScore: true, label: 'DOLO 650', strength: '650 mg', salt: 'Paracetamol IP' },
  'med-crocin650': { type: 'blister', primary: '#dc2626', secondary: '#fca5a5', pillColor: '#ffffff', pillShape: 'round', pillScore: true, label: 'CROCIN', strength: '650 mg', salt: 'Fast Paracetamol' },
  'med-combiflam': { type: 'blister', primary: '#ea580c', secondary: '#fed7aa', pillColor: '#fb923c', pillShape: 'oval', pillScore: false, label: 'COMBIFLAM', strength: '400+325', salt: 'Ibuprofen + Para' },
  'med-meftalspas': { type: 'blister', primary: '#2563eb', secondary: '#93c5fd', pillColor: '#fef08a', pillShape: 'round', pillScore: true, label: 'MEFTAL-SPAS', strength: '250+10', salt: 'Mefenamic + Dicy' },
  'med-zerodolp': { type: 'blister', primary: '#7c3aed', secondary: '#ddd6fe', pillColor: '#ffffff', pillShape: 'oval', pillScore: true, label: 'ZERODOL-P', strength: '100+325', salt: 'Aceclofenac + Para' },
  'med-saridon': { type: 'blister', primary: '#0284c7', secondary: '#bae6fd', pillColor: '#ffffff', pillShape: 'round', pillScore: true, label: 'SARIDON', strength: 'Triple Action', salt: 'Propyphenazone' },
  'med-voveran50': { type: 'blister', primary: '#b45309', secondary: '#fde68a', pillColor: '#f59e0b', pillShape: 'round', pillScore: false, label: 'VOVERAN 50', strength: '50 mg', salt: 'Diclofenac Sodium' },
  'med-flexon': { type: 'blister', primary: '#c026d3', secondary: '#f5d0fe', pillColor: '#ffffff', pillShape: 'oval', pillScore: true, label: 'FLEXON', strength: '400+325', salt: 'Ibuprofen + Para' },

  // Antibiotics
  'med-azithral500': { type: 'blister', primary: '#0d9488', secondary: '#99f6e4', pillColor: '#ffffff', pillShape: 'oblong', pillScore: true, label: 'AZITHRAL 500', strength: '500 mg', salt: 'Azithromycin IP' },
  'med-augmentin625': { type: 'blister', primary: '#1e3a8a', secondary: '#93c5fd', pillColor: '#ffffff', pillShape: 'oblong', pillScore: true, label: 'AUGMENTIN 625', strength: '625 mg', salt: 'Amoxycillin + Clav' },
  'med-taximo200': { type: 'blister', primary: '#4338ca', secondary: '#c7d2fe', pillColor: '#ffffff', pillShape: 'round', pillScore: true, label: 'TAXIM-O 200', strength: '200 mg', salt: 'Cefixime IP' },
  'med-ciplox500': { type: 'blister', primary: '#0369a1', secondary: '#bae6fd', pillColor: '#ffffff', pillShape: 'oblong', pillScore: true, label: 'CIPLOX 500', strength: '500 mg', salt: 'Ciprofloxacin IP' },
  'med-norfloxtz': { type: 'blister', primary: '#ca8a04', secondary: '#fef08a', pillColor: '#facc15', pillShape: 'oblong', pillScore: false, label: 'NORFLOX-TZ', strength: '400+600', salt: 'Norfloxacin + Tinid' },
  'med-moxikindcv': { type: 'blister', primary: '#047857', secondary: '#a7f3d0', pillColor: '#ffffff', pillShape: 'oblong', pillScore: true, label: 'MOXIKIND-CV', strength: '625 mg', salt: 'Amoxy + Clav' },
  'med-monocef200': { type: 'blister', primary: '#6d28d9', secondary: '#ddd6fe', pillColor: '#ffffff', pillShape: 'round', pillScore: true, label: 'MONOCEF-O', strength: '200 mg', salt: 'Cefpodoxime IP' },
  'med-oflox200': { type: 'blister', primary: '#0f766e', secondary: '#99f6e4', pillColor: '#ffffff', pillShape: 'round', pillScore: true, label: 'OFLOX 200', strength: '200 mg', salt: 'Ofloxacin IP' },

  // Blood Pressure & Heart
  'med-telma40': { type: 'blister', primary: '#e11d48', secondary: '#fecdd3', pillColor: '#f43f5e', pillShape: 'bicolor', pillScore: true, label: 'TELMA 40', strength: '40 mg', salt: 'Telmisartan IP' },
  'med-amlong5': { type: 'blister', primary: '#4f46e5', secondary: '#c7d2fe', pillColor: '#ffffff', pillShape: 'round', pillScore: true, label: 'AMLONG 5', strength: '5 mg', salt: 'Amlodipine Besylate' },
  'med-atorva10': { type: 'blister', primary: '#0284c7', secondary: '#bae6fd', pillColor: '#ffffff', pillShape: 'oval', pillScore: true, label: 'ATORVA 10', strength: '10 mg', salt: 'Atorvastatin IP' },
  'med-ecosprin75': { type: 'blister', primary: '#16a34a', secondary: '#bbf7d0', pillColor: '#86efac', pillShape: 'mini-round', pillScore: false, label: 'ECOSPRIN 75', strength: '75 mg', salt: 'Enteric Aspirin' },
  'med-rosuvas10': { type: 'blister', primary: '#db2777', secondary: '#fbcfe8', pillColor: '#f472b6', pillShape: 'round', pillScore: true, label: 'ROSUVAS 10', strength: '10 mg', salt: 'Rosuvastatin IP' },
  'med-concor5': { type: 'blister', primary: '#059669', secondary: '#a7f3d0', pillColor: '#fef08a', pillShape: 'heart', pillScore: true, label: 'CONCOR 5', strength: '5 mg', salt: 'Bisoprolol Fumarate' },
  'med-cilacar10': { type: 'blister', primary: '#2563eb', secondary: '#bfdbfe', pillColor: '#ffffff', pillShape: 'round', pillScore: true, label: 'CILACAR 10', strength: '10 mg', salt: 'Cilnidipine IP' },
  'med-telmah': { type: 'blister', primary: '#be123c', secondary: '#fecdd3', pillColor: '#f43f5e', pillShape: 'bicolor', pillScore: true, label: 'TELMA-H', strength: '40+12.5', salt: 'Telmisartan + HCTZ' },

  // Diabetes Care
  'med-glycomet500sr': { type: 'blister', primary: '#1d4ed8', secondary: '#bfdbfe', pillColor: '#ffffff', pillShape: 'oblong', pillScore: true, label: 'GLYCOMET 500', strength: '500 SR', salt: 'Metformin Sustained' },
  'med-januvia100': { type: 'blister', primary: '#d97706', secondary: '#fef3c7', pillColor: '#fde68a', pillShape: 'round', pillScore: false, label: 'JANUVIA 100', strength: '100 mg', salt: 'Sitagliptin IP' },
  'med-galvusmet': { type: 'blister', primary: '#b45309', secondary: '#fde68a', pillColor: '#f59e0b', pillShape: 'oblong', pillScore: true, label: 'GALVUS MET', strength: '50/500', salt: 'Vildagliptin + Met' },
  'med-accuchek': { type: 'device', primary: '#15803d', secondary: '#86efac', label: 'ACCU-CHEK', strength: '50 Strips', salt: 'Active Blood Glucose' },
  'med-janumet50': { type: 'blister', primary: '#be185d', secondary: '#fbcfe8', pillColor: '#f472b6', pillShape: 'oblong', pillScore: true, label: 'JANUMET', strength: '50/500', salt: 'Sitagliptin + Met' },
  'med-glycometgp2': { type: 'blister', primary: '#1e40af', secondary: '#bfdbfe', pillColor: '#ffffff', pillShape: 'bicolor', pillScore: true, label: 'GLYCOMET-GP2', strength: '2 mg+500', salt: 'Glimepiride + Met' },

  // Acidity & Digestion
  'med-pan40': { type: 'blister', primary: '#eab308', secondary: '#fef08a', pillColor: '#facc15', pillShape: 'oval', pillScore: false, label: 'PAN 40', strength: '40 mg', salt: 'Pantoprazole Gastro' },
  'med-omez20': { type: 'capsule', primary: '#dc2626', secondary: '#3b82f6', capTop: '#dc2626', capBottom: '#ffffff', label: 'OMEZ 20', strength: '20 mg', salt: 'Omeprazole IP' },
  'med-digene': { type: 'bottle', primary: '#ec4899', secondary: '#fbcfe8', liquidColor: '#f472b6', label: 'DIGENE GEL', strength: '200 ml', salt: 'Mint Antacid Liquid' },
  'med-digene-gel': { type: 'bottle', primary: '#db2777', secondary: '#fbcfe8', liquidColor: '#f472b6', label: 'DIGENE MINT', strength: '200 ml', salt: 'Acidity Relief' },
  'med-gelusil': { type: 'bottle', primary: '#059669', secondary: '#a7f3d0', liquidColor: '#6ee7b7', label: 'GELUSIL MPS', strength: '200 ml', salt: 'Antacid & Antigas' },
  'med-eno': { type: 'sachet', primary: '#0284c7', secondary: '#38bdf8', label: 'ENO REGULAR', strength: '6 Sachets', salt: 'Fast Fruit Salt 6s' },
  'med-cremaffin': { type: 'bottle', primary: '#4338ca', secondary: '#c7d2fe', liquidColor: '#e0e7ff', label: 'CREMAFFIN +', strength: '225 ml', salt: 'Laxative Emulsion' },
  'med-pan-d': { type: 'capsule', primary: '#eab308', secondary: '#ca8a04', capTop: '#eab308', capBottom: '#ffffff', label: 'PAN-D', strength: '40+30', salt: 'Pantoprazole + Dom' },
  'med-razod': { type: 'capsule', primary: '#0284c7', secondary: '#0369a1', capTop: '#0284c7', capBottom: '#facc15', label: 'RAZO-D', strength: '20+30', salt: 'Rabeprazole + Dom' },
  'med-electral': { type: 'sachet', primary: '#ea580c', secondary: '#fdba74', label: 'ELECTRAL', strength: '21.8g Sachet', salt: 'WHO Oral Rehydration' },

  // Cold, Cough & Allergy
  'med-allegra120': { type: 'blister', primary: '#9333ea', secondary: '#f3e8ff', pillColor: '#fed7aa', pillShape: 'oblong', pillScore: false, label: 'ALLEGRA 120', strength: '120 mg', salt: 'Fexofenadine HCl' },
  'med-cetcip10': { type: 'blister', primary: '#0891b2', secondary: '#cffafe', pillColor: '#ffffff', pillShape: 'round', pillScore: true, label: 'CETCIP 10', strength: '10 mg', salt: 'Cetirizine IP' },
  'med-montairlc': { type: 'blister', primary: '#4f46e5', secondary: '#e0e7ff', pillColor: '#ffffff', pillShape: 'oval', pillScore: true, label: 'MONTAIR-LC', strength: '10+5 mg', salt: 'Montelukast + Levo' },
  'med-benadryl': { type: 'bottle', primary: '#b91c1c', secondary: '#fca5a5', liquidColor: '#7f1d1d', label: 'BENADRYL', strength: '100 ml', salt: 'Cough Formula' },
  'med-vicksvaporub': { type: 'jar', primary: '#15803d', secondary: '#eab308', lidColor: '#166534', label: 'VICKS VAPORUB', strength: '50 ml Jar', salt: 'Menthol + Camphor' },
  'med-otrivin': { type: 'spray', primary: '#0284c7', secondary: '#38bdf8', label: 'OTRIVIN OXY', strength: '10 ml Spray', salt: 'Nasal Decongestant' },
  'med-chestoncold': { type: 'blister', primary: '#2563eb', secondary: '#93c5fd', pillColor: '#38bdf8', pillShape: 'round', pillScore: true, label: 'CHESTON COLD', strength: 'Multi-Action', salt: 'Cetirizine + Para' },

  // Vitamins & Supplements
  'med-shelcal500': { type: 'blister', primary: '#0284c7', secondary: '#e0f2fe', pillColor: '#ffffff', pillShape: 'oblong', pillScore: false, label: 'SHELCAL 500', strength: '500 mg+D3', salt: 'Calcium Carbonate' },
  'med-becosules': { type: 'capsule', primary: '#831843', secondary: '#000000', capTop: '#831843', capBottom: '#18181b', label: 'BECOSULES', strength: 'B-Complex', salt: 'Vitamin B + C' },
  'med-neurobion': { type: 'blister', primary: '#dc2626', secondary: '#fee2e2', pillColor: '#ef4444', pillShape: 'round', pillScore: false, label: 'NEUROBION', strength: 'Forte B12', salt: 'B1 + B6 + B12' },
  'med-neurobionforte': { type: 'blister', primary: '#dc2626', secondary: '#fee2e2', pillColor: '#ef4444', pillShape: 'round', pillScore: false, label: 'NEUROBION', strength: 'Forte Strip', salt: 'Nerve Nutrition' },
  'med-limcee500': { type: 'blister', primary: '#ea580c', secondary: '#ffedd5', pillColor: '#f97316', pillShape: 'round', pillScore: true, label: 'LIMCEE 500', strength: '500 mg', salt: 'Chewable Vitamin C' },
  'med-limcee': { type: 'blister', primary: '#ea580c', secondary: '#ffedd5', pillColor: '#f97316', pillShape: 'round', pillScore: true, label: 'LIMCEE 500', strength: 'Orange Vit-C', salt: 'Ascorbic Acid IP' },
  'med-uprised3': { type: 'softgel', primary: '#f59e0b', secondary: '#fef3c7', gelColor: '#fbbf24', label: 'UPRISE-D3', strength: '60,000 IU', salt: 'Cholecalciferol' },
  'med-revitalh': { type: 'bottle', primary: '#92400e', secondary: '#fef3c7', liquidColor: '#78350f', label: 'REVITAL H', strength: '30 Daily', salt: 'Ginseng + Minerals' },
  'med-evion400': { type: 'softgel', primary: '#059669', secondary: '#d1fae5', gelColor: '#10b981', label: 'EVION 400', strength: '400 mg', salt: 'Pure Vitamin E' },

  // First Aid & Skin
  'med-betadine': { type: 'tube', primary: '#78350f', secondary: '#dc2626', label: 'BETADINE 10%', strength: '20g Ointment', salt: 'Povidone-Iodine IP' },
  'med-dettol': { type: 'bottle', primary: '#15803d', secondary: '#fef08a', liquidColor: '#d97706', label: 'DETTOL', strength: '250 ml', salt: 'Antiseptic Liquid' },
  'med-volini': { type: 'tube', primary: '#1d4ed8', secondary: '#ef4444', label: 'VOLINI GEL', strength: '50g Tube', salt: 'Diclofenac + Menthol' },
  'med-hansaplast': { type: 'device', primary: '#0284c7', secondary: '#bae6fd', label: 'HANSAPLAST', strength: '20 Bandages', salt: 'Medicated Plasters' },
  'med-soframycin': { type: 'tube', primary: '#0f766e', secondary: '#99f6e4', label: 'SOFRAMYCIN', strength: '30g Cream', salt: 'Framycetin Skin' },

  // Ayurveda & Immunity
  'med-chyawanprash': { type: 'jar', primary: '#b45309', secondary: '#fde68a', lidColor: '#78350f', label: 'CHYAWANPRASH', strength: '1 kg Family', salt: 'Amla & 40+ Herbs' },
  'med-liv52ds': { type: 'bottle', primary: '#15803d', secondary: '#dcfce7', liquidColor: '#14532d', label: 'LIV.52 DS', strength: '60 Tablets', salt: 'Himalaya Liver Care' },
  'med-zandubalm': { type: 'jar', primary: '#dc2626', secondary: '#fef08a', lidColor: '#991b1b', label: 'ZANDU BALM', strength: '25 ml Jar', salt: 'Fast Headache Relief' },

  // Eye & Ear Care
  'med-refresh-tears': { type: 'dropper', primary: '#0284c7', secondary: '#e0f2fe', label: 'REFRESH TEARS', strength: '10 ml Eye', salt: 'Lubricant Eye Drops' },
  'med-ciplox-eye': { type: 'dropper', primary: '#0891b2', secondary: '#cffafe', label: 'CIPLOX EYE/EAR', strength: '10 ml Sterile', salt: 'Ciprofloxacin Drops' },
  'med-waxolve': { type: 'dropper', primary: '#d97706', secondary: '#fef3c7', label: 'WAXOLVE', strength: '10 ml Ear', salt: 'Ear Wax Dissolver' }
};

function generateBlisterSVG(med, cfg) {
  const p = cfg.primary || '#1e40af';
  const s = cfg.secondary || '#93c5fd';
  const pillColor = cfg.pillColor || '#ffffff';
  const label = cfg.label || med.name.toUpperCase();
  const strength = cfg.strength || 'Tablet';
  const salt = cfg.salt || med.genericName;
  const isOblong = cfg.pillShape === 'oblong';
  const isBicolor = cfg.pillShape === 'bicolor';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220" width="100%" height="100%">
  <defs>
    <linearGradient id="foil-${med.id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="25%" stop-color="#e2e8f0" />
      <stop offset="50%" stop-color="#ffffff" />
      <stop offset="75%" stop-color="#cbd5e1" />
      <stop offset="100%" stop-color="#e2e8f0" />
    </linearGradient>
    <linearGradient id="brandGrad-${med.id}" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${p}" />
      <stop offset="100%" stop-color="${s}" />
    </linearGradient>
    <filter id="dropShadow-${med.id}" x="-10%" y="-10%" width="120%" height="125%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.12" />
    </filter>
    <radialGradient id="pillShine-${med.id}" cx="35%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9" />
      <stop offset="60%" stop-color="${pillColor}" />
      <stop offset="100%" stop-color="#94a3b8" stop-opacity="0.6" />
    </radialGradient>
  </defs>

  <rect width="320" height="220" rx="20" fill="#f8fafc" />
  <circle cx="260" cy="50" r="70" fill="${s}" opacity="0.12" />

  <!-- Blister Foil Strip -->
  <g filter="url(#dropShadow-${med.id})">
    <rect x="30" y="24" width="260" height="172" rx="14" fill="url(#foil-${med.id})" stroke="#94a3b8" stroke-width="1.5" />
    <!-- Perforation Lines -->
    <line x1="30" y1="102" x2="290" y2="102" stroke="#94a3b8" stroke-dasharray="3,3" stroke-width="1" opacity="0.6" />
    <line x1="116" y1="24" x2="116" y2="196" stroke="#94a3b8" stroke-dasharray="3,3" stroke-width="1" opacity="0.6" />
    <line x1="204" y1="24" x2="204" y2="196" stroke="#94a3b8" stroke-width="1" opacity="0.6" />

    <!-- Top Brand Header Ribbon on Foil -->
    <rect x="30" y="24" width="260" height="30" rx="12" fill="url(#brandGrad-${med.id})" />
    <rect x="30" y="44" width="260" height="10" fill="url(#brandGrad-${med.id})" />
    <text x="44" y="45" fill="#ffffff" font-family="'Poppins',system-ui,sans-serif" font-weight="900" font-size="12" letter-spacing="0.5">${label}</text>
    <rect x="230" y="30" width="50" height="18" rx="6" fill="#ffffff" fill-opacity="0.25" />
    <text x="255" y="43" fill="#ffffff" font-family="sans-serif" font-weight="800" font-size="8.5" text-anchor="middle">${strength}</text>
  </g>

  <!-- 6 Embossed Pill Cavities -->
  <g>
    <ellipse cx="73" cy="74" rx="${isOblong ? 26 : 21}" ry="${isOblong ? 14 : 21}" fill="url(#pillShine-${med.id})" stroke="#64748b" stroke-width="1.2" filter="url(#dropShadow-${med.id})" />
    <ellipse cx="160" cy="74" rx="${isOblong ? 26 : 21}" ry="${isOblong ? 14 : 21}" fill="url(#pillShine-${med.id})" stroke="#64748b" stroke-width="1.2" filter="url(#dropShadow-${med.id})" />
    <ellipse cx="247" cy="74" rx="${isOblong ? 26 : 21}" ry="${isOblong ? 14 : 21}" fill="url(#pillShine-${med.id})" stroke="#64748b" stroke-width="1.2" filter="url(#dropShadow-${med.id})" />

    <ellipse cx="73" cy="144" rx="${isOblong ? 26 : 21}" ry="${isOblong ? 14 : 21}" fill="url(#pillShine-${med.id})" stroke="#64748b" stroke-width="1.2" filter="url(#dropShadow-${med.id})" />
    <ellipse cx="160" cy="144" rx="${isOblong ? 26 : 21}" ry="${isOblong ? 14 : 21}" fill="url(#pillShine-${med.id})" stroke="#64748b" stroke-width="1.2" filter="url(#dropShadow-${med.id})" />
    <ellipse cx="247" cy="144" rx="${isOblong ? 26 : 21}" ry="${isOblong ? 14 : 21}" fill="url(#pillShine-${med.id})" stroke="#64748b" stroke-width="1.2" filter="url(#dropShadow-${med.id})" />

    ${cfg.pillScore ? `
      <line x1="73" y1="63" x2="73" y2="85" stroke="#94a3b8" stroke-width="1" opacity="0.7" />
      <line x1="160" y1="63" x2="160" y2="85" stroke="#94a3b8" stroke-width="1" opacity="0.7" />
      <line x1="247" y1="63" x2="247" y2="85" stroke="#94a3b8" stroke-width="1" opacity="0.7" />
      <line x1="73" y1="133" x2="73" y2="155" stroke="#94a3b8" stroke-width="1" opacity="0.7" />
      <line x1="160" y1="133" x2="160" y2="155" stroke="#94a3b8" stroke-width="1" opacity="0.7" />
      <line x1="247" y1="133" x2="247" y2="155" stroke="#94a3b8" stroke-width="1" opacity="0.7" />
    ` : ''}

    ${isBicolor ? `
      <path d="M 52 74 A 21 21 0 0 1 94 74 Z" fill="${p}" opacity="0.85" />
      <path d="M 139 74 A 21 21 0 0 1 181 74 Z" fill="${p}" opacity="0.85" />
      <path d="M 226 74 A 21 21 0 0 1 268 74 Z" fill="${p}" opacity="0.85" />
      <path d="M 52 144 A 21 21 0 0 1 94 144 Z" fill="${p}" opacity="0.85" />
      <path d="M 139 144 A 21 21 0 0 1 181 144 Z" fill="${p}" opacity="0.85" />
      <path d="M 226 144 A 21 21 0 0 1 268 144 Z" fill="${p}" opacity="0.85" />
    ` : ''}
  </g>

  <!-- Bottom Foil Print -->
  <text x="160" y="186" fill="#64748b" font-family="sans-serif" font-weight="600" font-size="8.5" text-anchor="middle" letter-spacing="0.3">${salt.substring(0, 32)}</text>
</svg>`;
}

function generateBottleSVG(med, cfg) {
  const p = cfg.primary || '#b91c1c';
  const s = cfg.secondary || '#fca5a5';
  const liquid = cfg.liquidColor || '#7f1d1d';
  const label = cfg.label || med.name.toUpperCase();
  const strength = cfg.strength || '200 ml';
  const salt = cfg.salt || med.genericName;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220" width="100%" height="100%">
  <defs>
    <linearGradient id="glassGrad-${med.id}" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.4" />
      <stop offset="20%" stop-color="${liquid}" stop-opacity="0.9" />
      <stop offset="70%" stop-color="${liquid}" stop-opacity="1" />
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.3" />
    </linearGradient>
    <filter id="shadow-${med.id}">
      <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.15" />
    </filter>
  </defs>

  <rect width="320" height="220" rx="20" fill="#f8fafc" />
  <circle cx="160" cy="110" r="85" fill="${s}" opacity="0.15" />

  <g filter="url(#shadow-${med.id})">
    <!-- Measuring Cap on Top -->
    <path d="M 144 20 L 176 20 L 178 38 L 142 38 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" />
    <line x1="148" y1="26" x2="158" y2="26" stroke="#94a3b8" stroke-width="1" />
    <line x1="148" y1="32" x2="162" y2="32" stroke="#94a3b8" stroke-width="1" />

    <!-- Bottle Neck -->
    <rect x="146" y="38" width="28" height="18" rx="2" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1.5" />
    <rect x="142" y="46" width="36" height="5" rx="2" fill="#e2e8f0" />

    <!-- Bottle Body -->
    <path d="M 146 56 C 130 62 110 75 110 95 L 110 185 C 110 195 118 200 128 200 L 192 200 C 202 200 210 195 210 185 L 210 95 C 210 75 190 62 174 56 Z" fill="url(#glassGrad-${med.id})" stroke="#475569" stroke-width="1.5" />
    <path d="M 115 100 L 115 180" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.6" />

    <!-- Label Paper -->
    <rect x="116" y="92" width="88" height="82" rx="6" fill="#ffffff" stroke="#e2e8f0" stroke-width="1" />
    <rect x="116" y="92" width="88" height="24" rx="5" fill="${p}" />
    <text x="160" y="108" fill="#ffffff" font-family="'Poppins',sans-serif" font-weight="900" font-size="9" text-anchor="middle">${label}</text>

    <!-- Cross/Liquid Icon -->
    <circle cx="160" cy="130" r="10" fill="${s}" opacity="0.3" />
    <path d="M 160 123 L 160 137 M 153 130 L 167 130" stroke="${p}" stroke-width="2.5" stroke-linecap="round" />

    <text x="160" y="154" fill="#0f172a" font-family="sans-serif" font-weight="800" font-size="9" text-anchor="middle">${strength}</text>
    <text x="160" y="166" fill="#64748b" font-family="sans-serif" font-weight="600" font-size="7" text-anchor="middle">${salt.substring(0, 18)}</text>
  </g>
</svg>`;
}

function generateTubeSVG(med, cfg) {
  const p = cfg.primary || '#1d4ed8';
  const s = cfg.secondary || '#ef4444';
  const label = cfg.label || med.name.toUpperCase();
  const strength = cfg.strength || 'Gel / Ointment';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220" width="100%" height="100%">
  <defs>
    <linearGradient id="tubeGrad-${med.id}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="25%" stop-color="#f1f5f9" />
      <stop offset="60%" stop-color="#cbd5e1" />
      <stop offset="100%" stop-color="#94a3b8" />
    </linearGradient>
    <filter id="shadow-${med.id}">
      <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.15" />
    </filter>
  </defs>

  <rect width="320" height="220" rx="20" fill="#f8fafc" />
  <circle cx="160" cy="110" r="80" fill="${s}" opacity="0.12" />

  <g filter="url(#shadow-${med.id})" transform="rotate(-12 160 110)">
    <!-- Tube Body -->
    <path d="M 60 88 L 220 74 C 235 74 245 84 245 100 L 245 120 C 245 136 235 146 220 146 L 60 132 Z" fill="url(#tubeGrad-${med.id})" stroke="#64748b" stroke-width="1.5" />
    <rect x="50" y="88" width="12" height="44" rx="2" fill="#94a3b8" stroke="#475569" stroke-width="1" />

    <!-- Brand Design Band -->
    <path d="M 100 85 L 180 78 L 180 142 L 100 135 Z" fill="${p}" />
    <path d="M 180 78 L 195 76 L 195 144 L 180 142 Z" fill="${s}" />
    <text x="140" y="115" fill="#ffffff" font-family="'Poppins',sans-serif" font-weight="900" font-size="11" text-anchor="middle">${label}</text>
    <text x="140" y="128" fill="#f8fafc" font-family="sans-serif" font-weight="700" font-size="7" text-anchor="middle">${strength}</text>

    <!-- Screw Cap -->
    <path d="M 245 92 L 255 95 L 255 125 L 245 128 Z" fill="#e2e8f0" stroke="#64748b" stroke-width="1.5" />
    <rect x="255" y="94" width="28" height="32" rx="4" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5" />
  </g>
</svg>`;
}

function generateCapsuleSVG(med, cfg) {
  const p = cfg.primary || '#dc2626';
  const capTop = cfg.capTop || p;
  const capBottom = cfg.capBottom || '#ffffff';
  const label = cfg.label || med.name.toUpperCase();
  const strength = cfg.strength || 'Capsules';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220" width="100%" height="100%">
  <defs>
    <linearGradient id="foil-${med.id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f8fafc" />
      <stop offset="50%" stop-color="#e2e8f0" />
      <stop offset="100%" stop-color="#cbd5e1" />
    </linearGradient>
    <filter id="shadow-${med.id}">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.12" />
    </filter>
  </defs>

  <rect width="320" height="220" rx="20" fill="#f8fafc" />
  <circle cx="240" cy="80" r="70" fill="${p}" opacity="0.12" />

  <g filter="url(#shadow-${med.id})">
    <rect x="30" y="24" width="260" height="172" rx="14" fill="url(#foil-${med.id})" stroke="#94a3b8" stroke-width="1.5" />
    <rect x="30" y="24" width="260" height="30" rx="12" fill="${p}" />
    <rect x="30" y="44" width="260" height="10" fill="${p}" />
    <text x="44" y="45" fill="#ffffff" font-family="'Poppins',sans-serif" font-weight="900" font-size="12">${label}</text>
    <text x="270" y="45" fill="#ffffff" font-family="sans-serif" font-weight="800" font-size="9" text-anchor="end">${strength}</text>

    <!-- Capsules -->
    <g transform="translate(73, 90)">
      <rect x="-11" y="-24" width="22" height="24" rx="11" fill="${capTop}" />
      <rect x="-11" y="0" width="22" height="24" rx="11" fill="${capBottom}" stroke="#94a3b8" stroke-width="0.8" />
    </g>
    <g transform="translate(160, 90)">
      <rect x="-11" y="-24" width="22" height="24" rx="11" fill="${capTop}" />
      <rect x="-11" y="0" width="22" height="24" rx="11" fill="${capBottom}" stroke="#94a3b8" stroke-width="0.8" />
    </g>
    <g transform="translate(247, 90)">
      <rect x="-11" y="-24" width="22" height="24" rx="11" fill="${capTop}" />
      <rect x="-11" y="0" width="22" height="24" rx="11" fill="${capBottom}" stroke="#94a3b8" stroke-width="0.8" />
    </g>

    <g transform="translate(73, 150)">
      <rect x="-11" y="-24" width="22" height="24" rx="11" fill="${capTop}" />
      <rect x="-11" y="0" width="22" height="24" rx="11" fill="${capBottom}" stroke="#94a3b8" stroke-width="0.8" />
    </g>
    <g transform="translate(160, 150)">
      <rect x="-11" y="-24" width="22" height="24" rx="11" fill="${capTop}" />
      <rect x="-11" y="0" width="22" height="24" rx="11" fill="${capBottom}" stroke="#94a3b8" stroke-width="0.8" />
    </g>
    <g transform="translate(247, 150)">
      <rect x="-11" y="-24" width="22" height="24" rx="11" fill="${capTop}" />
      <rect x="-11" y="0" width="22" height="24" rx="11" fill="${capBottom}" stroke="#94a3b8" stroke-width="0.8" />
    </g>
  </g>
</svg>`;
}

function generateSoftgelSVG(med, cfg) {
  const p = cfg.primary || '#059669';
  const gel = cfg.gelColor || '#10b981';
  const label = cfg.label || med.name.toUpperCase();
  const strength = cfg.strength || 'Softgels';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220" width="100%" height="100%">
  <defs>
    <radialGradient id="softgelGrad-${med.id}" cx="35%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9" />
      <stop offset="40%" stop-color="${gel}" stop-opacity="0.95" />
      <stop offset="100%" stop-color="${p}" />
    </radialGradient>
    <filter id="shadow-${med.id}">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.12" />
    </filter>
  </defs>

  <rect width="320" height="220" rx="20" fill="#f8fafc" />
  <circle cx="240" cy="80" r="70" fill="${gel}" opacity="0.15" />

  <g filter="url(#shadow-${med.id})">
    <rect x="30" y="24" width="260" height="172" rx="14" fill="#f1f5f9" stroke="#94a3b8" stroke-width="1.5" />
    <rect x="30" y="24" width="260" height="30" rx="12" fill="${p}" />
    <rect x="30" y="44" width="260" height="10" fill="${p}" />
    <text x="44" y="45" fill="#ffffff" font-family="'Poppins',sans-serif" font-weight="900" font-size="12">${label}</text>
    <text x="270" y="45" fill="#ffffff" font-family="sans-serif" font-weight="800" font-size="9" text-anchor="end">${strength}</text>

    <!-- Shiny Translucent Softgels -->
    <ellipse cx="73" cy="95" rx="24" ry="15" fill="url(#softgelGrad-${med.id})" stroke="${p}" stroke-width="1" />
    <ellipse cx="160" cy="95" rx="24" ry="15" fill="url(#softgelGrad-${med.id})" stroke="${p}" stroke-width="1" />
    <ellipse cx="247" cy="95" rx="24" ry="15" fill="url(#softgelGrad-${med.id})" stroke="${p}" stroke-width="1" />

    <ellipse cx="73" cy="148" rx="24" ry="15" fill="url(#softgelGrad-${med.id})" stroke="${p}" stroke-width="1" />
    <ellipse cx="160" cy="148" rx="24" ry="15" fill="url(#softgelGrad-${med.id})" stroke="${p}" stroke-width="1" />
    <ellipse cx="247" cy="148" rx="24" ry="15" fill="url(#softgelGrad-${med.id})" stroke="${p}" stroke-width="1" />
  </g>
</svg>`;
}

function generateDropperSVG(med, cfg) {
  const p = cfg.primary || '#0284c7';
  const s = cfg.secondary || '#bae6fd';
  const label = cfg.label || med.name.toUpperCase();
  const strength = cfg.strength || '10 ml';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220" width="100%" height="100%">
  <defs>
    <filter id="shadow-${med.id}">
      <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.15" />
    </filter>
  </defs>

  <rect width="320" height="220" rx="20" fill="#f8fafc" />
  <circle cx="160" cy="110" r="80" fill="${s}" opacity="0.2" />

  <g filter="url(#shadow-${med.id})">
    <path d="M 156 25 L 164 25 L 166 45 L 154 45 Z" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5" />
    <rect x="148" y="45" width="24" height="20" rx="3" fill="${p}" stroke="#0f172a" stroke-width="1" />
    <path d="M 148 65 C 135 70 125 82 125 100 L 125 175 C 125 188 135 195 145 195 L 175 195 C 185 195 195 188 195 175 L 195 100 C 195 82 185 70 172 65 Z" fill="#ffffff" stroke="#94a3b8" stroke-width="1.8" />
    <rect x="130" y="102" width="60" height="65" rx="4" fill="#f0fdf4" stroke="${p}" stroke-width="1" />
    <rect x="130" y="102" width="60" height="18" rx="3" fill="${p}" />
    <text x="160" y="115" fill="#ffffff" font-family="'Poppins',sans-serif" font-weight="800" font-size="7.5" text-anchor="middle">${label}</text>
    <path d="M 160 128 C 153 135 153 142 160 148 C 167 142 167 135 160 128 Z" fill="${p}" />
    <text x="160" y="160" fill="#0f172a" font-family="sans-serif" font-weight="800" font-size="8" text-anchor="middle">${strength}</text>
  </g>
</svg>`;
}

function generateJarSVG(med, cfg) {
  const p = cfg.primary || '#15803d';
  const s = cfg.secondary || '#fde047';
  const lid = cfg.lidColor || p;
  const label = cfg.label || med.name.toUpperCase();
  const strength = cfg.strength || 'Balm / Jar';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220" width="100%" height="100%">
  <defs>
    <filter id="shadow-${med.id}">
      <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.15" />
    </filter>
  </defs>

  <rect width="320" height="220" rx="20" fill="#f8fafc" />
  <circle cx="160" cy="110" r="80" fill="${s}" opacity="0.2" />

  <g filter="url(#shadow-${med.id})">
    <ellipse cx="160" cy="65" rx="60" ry="18" fill="${lid}" stroke="#ffffff" stroke-width="2" />
    <rect x="100" y="65" width="120" height="18" fill="${lid}" stroke="#334155" stroke-width="1" />
    <ellipse cx="160" cy="83" rx="60" ry="16" fill="${lid}" />
    <path d="M 102 82 L 102 165 C 102 185 125 195 160 195 C 195 195 218 185 218 165 L 218 82 Z" fill="#ffffff" stroke="#64748b" stroke-width="1.8" />
    <rect x="105" y="98" width="110" height="60" rx="6" fill="${p}" />
    <text x="160" y="124" fill="#ffffff" font-family="'Poppins',sans-serif" font-weight="900" font-size="11" text-anchor="middle">${label}</text>
    <rect x="125" y="133" width="70" height="16" rx="8" fill="${s}" />
    <text x="160" y="145" fill="#0f172a" font-family="sans-serif" font-weight="800" font-size="8.5" text-anchor="middle">${strength}</text>
  </g>
</svg>`;
}

function generateSachetOrDeviceSVG(med, cfg) {
  const p = cfg.primary || '#0284c7';
  const s = cfg.secondary || '#38bdf8';
  const label = cfg.label || med.name.toUpperCase();
  const strength = cfg.strength || 'Pack';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220" width="100%" height="100%">
  <defs>
    <filter id="shadow-${med.id}">
      <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.15" />
    </filter>
  </defs>

  <rect width="320" height="220" rx="20" fill="#f8fafc" />
  <circle cx="160" cy="110" r="80" fill="${s}" opacity="0.2" />

  <g filter="url(#shadow-${med.id})">
    <rect x="80" y="30" width="160" height="160" rx="8" fill="#ffffff" stroke="#94a3b8" stroke-width="1.8" />
    <rect x="80" y="30" width="160" height="14" fill="#e2e8f0" />
    <rect x="80" y="176" width="160" height="14" fill="#e2e8f0" />
    <rect x="92" y="58" width="136" height="36" rx="6" fill="${p}" />
    <text x="160" y="81" fill="#ffffff" font-family="'Poppins',sans-serif" font-weight="900" font-size="12" text-anchor="middle">${label}</text>
    <circle cx="160" cy="122" r="20" fill="${s}" opacity="0.25" />
    <path d="M 150 122 Q 155 115 160 122 T 170 122" stroke="${p}" stroke-width="3" fill="none" stroke-linecap="round" />
    <text x="160" y="156" fill="#0f172a" font-family="sans-serif" font-weight="800" font-size="10" text-anchor="middle">${strength}</text>
  </g>
</svg>`;
}

let count = 0;
MEDICINE_CATALOG.forEach(med => {
  const id = med.id;
  const cfg = { ...(BRAND_STYLES[id] || {}) };
  const name = (med.name || '').toLowerCase();
  const pack = (med.packSize || '').toLowerCase();
  const cat = (med.category || '').toLowerCase();

  if (!cfg.type) {
    if (name.includes('syrup') || pack.includes('syrup') || pack.includes('bottle') || pack.includes('liquid') || pack.includes('suspension')) {
      cfg.type = 'bottle';
    } else if (name.includes('ointment') || name.includes('cream') || name.includes('gel') || pack.includes('tube')) {
      cfg.type = 'tube';
    } else if (cat.includes('eye') || cat.includes('ear') || name.includes('drops') || pack.includes('dropper')) {
      cfg.type = 'dropper';
    } else if (name.includes('capsule') || pack.includes('capsule')) {
      cfg.type = 'capsule';
    } else if (name.includes('softgel')) {
      cfg.type = 'softgel';
    } else if (name.includes('balm') || name.includes('jar')) {
      cfg.type = 'jar';
    } else if (name.includes('sachet') || name.includes('powder')) {
      cfg.type = 'sachet';
    } else {
      cfg.type = 'blister';
    }
  }

  if (!cfg.label) {
    cfg.label = med.name.split(' ')[0].toUpperCase();
  }
  if (!cfg.strength) {
    cfg.strength = med.packSize.split(' ')[2] ? med.packSize.split(' ')[2] : 'Pack';
  }
  if (!cfg.salt) {
    cfg.salt = med.genericName;
  }

  let svg = '';
  if (cfg.type === 'bottle') {
    svg = generateBottleSVG(med, cfg);
  } else if (cfg.type === 'tube') {
    svg = generateTubeSVG(med, cfg);
  } else if (cfg.type === 'capsule') {
    svg = generateCapsuleSVG(med, cfg);
  } else if (cfg.type === 'dropper') {
    svg = generateDropperSVG(med, cfg);
  } else if (cfg.type === 'jar') {
    svg = generateJarSVG(med, cfg);
  } else if (cfg.type === 'softgel') {
    svg = generateSoftgelSVG(med, cfg);
  } else if (cfg.type === 'sachet' || cfg.type === 'device') {
    svg = generateSachetOrDeviceSVG(med, cfg);
  } else {
    svg = generateBlisterSVG(med, cfg);
  }

  const filePath = path.join(outDir, `${id}.svg`);
  fs.writeFileSync(filePath, svg, 'utf-8');
  count++;
});

console.log(`Generated ${count} unique medicine SVG images in ${outDir}`);
