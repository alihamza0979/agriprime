/**
 * stripScreenLayouts.cjs
 * Rewrites each screen component to remove its embedded nav/sidebar,
 * keeping only the <main> content so App.jsx shell handles navigation.
 */
const fs = require('fs');
const path = require('path');

const screensDir = path.join(__dirname, 'src', 'screens');
const files = fs.readdirSync(screensDir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
  const filePath = path.join(screensDir, file);
  const componentName = file.replace('.jsx', '');
  let content = fs.readFileSync(filePath, 'utf8');

  // ── Remove the <nav> block ──────────────────────────────────────
  // Matches <nav ...>...</nav> for the top navigation bar
  content = content.replace(/<nav\b[^>]*>[\s\S]*?<\/nav>/g, (match) => {
    // Keep nav tags that are INSIDE main (e.g., breadcrumb nav)
    // Heuristic: if the match is a standalone top-nav (contains 'fixed top-0' or 'w-full'), remove it
    if (/fixed\s+top-0|fixed top-0|w-full z-50|z-50/.test(match)) {
      return '{/* nav removed – handled by App shell */}';
    }
    return match;
  });

  // ── Remove the <aside> block ───────────────────────────────────
  // Matches <aside ...>...</aside> for the sidebar
  content = content.replace(/<aside\b[^>]*>[\s\S]*?<\/aside>/g, (match) => {
    if (/fixed\s+left-0|h-screen|sidebar|z-40/.test(match)) {
      return '{/* aside removed – handled by App shell */}';
    }
    return match;
  });

  // ── Remove margin/padding offsets added for sidebar (ml-64, pl-64) ──
  // In the <main> tag, ml-64 and pt-24 are no longer needed
  content = content.replace(/<main([^>]*)>/g, (match, attrs) => {
    const cleaned = attrs
      .replace(/\bml-64\b/g, '')
      .replace(/\bpt-24\b/g, 'pt-6')
      .replace(/\bpl-64\b/g, '')
      .trim();
    return `<main${cleaned ? ' ' + cleaned : ''}>`;
  });

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Processed ${file}`);
});

console.log('\nDone! All screen layouts stripped.');
