/**
 * finalFix.cjs
 * Comprehensive fix for all AgriPrime screen components:
 * 1. Remove internal duplicate headers/navbars
 * 2. Fix layout/width constraints
 * 3. Apply Pakistani localization (names + PKR currency)
 */
const fs = require('fs');
const path = require('path');

const screensDir = path.join(__dirname, 'src', 'screens');
const files = fs.readdirSync(screensDir).filter(f => f.endsWith('.jsx'));

// ── Pakistani Name Replacements ──────────────────────────────────
const nameMap = [
  ['Jameson Thorne', 'Haroon Sheikh'],
  ['Kyle Evans', 'Bilal Raza'],
  ['Elena Vance', 'Fatima Malik'],
  ['Samuel Miller', 'Usman Ahmed'],
  ['Marcus Reed', 'Tariq Hassan'],
  ['Lia Thompson', 'Sara Khan'],
  ['Helena Vance', 'Dr. Fatima Malik'],
  ['Dr. Helena Vance', 'Dr. Fatima Malik'],
  ['Dr. Samuel Miller', 'Dr. Usman Ahmed'],
  ['Sarah Johnson', 'Ayesha Siddiqui'],
  ['James Mitchell', 'Imran Qureshi'],
  ['Farm Manager', 'Zamin In-Charge'],
  ['Manager Profile', 'In-Charge Profile'],
  ['Clover Co.', 'Punjab Dairy Co.'],
];

// ── Currency Replacements ────────────────────────────────────────
const currencyMap = [
  // Large values (millions)
  [/\$2\.4M/g, '₨240M'],
  [/\$1\.6M/g, '₨160M'],
  [/\$800k/g, '₨80M'],
  [/\$42\.8k/g, '₨4.28M'],
  [/\$42,100\.00/g, '₨4,210,000'],
  [/\$12,450\.00/g, '₨1,245,000'],
  [/\$4,200\.00/g, '₨420,000'],
  [/\$1,150\.00/g, '₨115,000'],
  [/\$450k/g, '₨45M'],
  [/\$250k/g, '₨25M'],
  [/\$100k/g, '₨10M'],
  [/\$42\.8k/g, '₨4.28M'],
  // Generic $ → ₨
  [/\$(\d)/g, '₨$1'],
];

function removeInternalHeader(content) {
  // Remove any <header> element that has sticky/z-40/backdrop-blur (it's a duplicate topbar)
  // Strategy: match <header> with those classes and remove the entire block
  let result = content;

  // Match <header className="...z-40..." or "...sticky..." > ... </header>
  // Use a loop to handle nested structures
  let changed = true;
  while (changed) {
    changed = false;
    const headerMatch = result.match(/<header\b([^>]*)>([\s\S]*?)<\/header>/);
    if (headerMatch) {
      const attrs = headerMatch[1];
      // Only remove if it's a duplicate topbar (has backdrop-blur, z-40, sticky, etc.)
      if (/z-40|z-50|backdrop-blur|sticky\s+top-0/.test(attrs)) {
        result = result.replace(headerMatch[0], '{/* internal header removed – handled by App shell */}');
        changed = true;
      }
    }
  }
  return result;
}

function fixMainElement(content) {
  // Remove ml-72, ml-64, ml-80 etc. from <main>
  // Remove min-h-screen (can cause scroll issues)
  return content.replace(/<main\b([^>]*)>/g, (match, attrs) => {
    let cleaned = attrs
      .replace(/\bml-\d+\b/g, '')
      .replace(/\bpl-\d+\b/g, '')
      .replace(/\bmin-h-screen\b/g, 'min-h-full')
      .trim();
    // Ensure w-full is present
    if (!cleaned.includes('w-full') && !cleaned.includes('className')) {
      cleaned = `className="w-full"`;
    } else {
      // Inject w-full into existing className
      cleaned = cleaned.replace(/className="([^"]*)"/, (m, c) => {
        if (!c.includes('w-full')) return `className="w-full ${c.trim()}"`;
        return m;
      });
    }
    return `<main ${cleaned}>`;
  });
}

function removeMaxWidthConstraints(content) {
  // Remove max-w-7xl, max-w-[1400px] etc. from top-level content divs
  // These prevent full-width layout
  return content
    .replace(/\bmax-w-7xl\s*/g, '')
    .replace(/\bmax-w-6xl\s*/g, '')
    .replace(/\bmax-w-5xl\s*/g, '')
    .replace(/\bmax-w-\[[\d\w]+\]\s*/g, '')
    .replace(/\bmx-auto\b/g, ''); // Also remove auto centering
}

function applyPakistaniNames(content) {
  let result = content;
  for (const [eng, pak] of nameMap) {
    result = result.replace(new RegExp(eng, 'g'), pak);
  }
  return result;
}

function applyPKRCurrency(content) {
  let result = content;
  for (const [pattern, replacement] of currencyMap) {
    result = result.replace(pattern, replacement);
  }
  return result;
}

// Process each file
files.forEach(file => {
  const filePath = path.join(screensDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  content = removeInternalHeader(content);
  content = fixMainElement(content);
  content = removeMaxWidthConstraints(content);
  content = applyPakistaniNames(content);
  content = applyPKRCurrency(content);

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✓ Fixed: ${file}`);
});

console.log('\n✅ All screens fixed with Pakistani localization and layout corrections.');
