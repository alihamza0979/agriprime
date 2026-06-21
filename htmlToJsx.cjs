const fs = require('fs');

const inputFile = 'C:\\Users\\ranaa\\.gemini\\antigravity\\brain\\fefb7399-80e0-4649-85c1-2d8727c9516b\\.system_generated\\steps\\65\\output.txt';
const html = fs.readFileSync(inputFile, 'utf-8');

// Extract the body content
const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
if (!bodyMatch) {
  console.error("No body found");
  process.exit(1);
}

let jsx = bodyMatch[1];
// Replace class with className
jsx = jsx.replace(/class=/g, 'className=');
// Replace style attributes (naive replacement for the dashboard tags)
jsx = jsx.replace(/style="([^"]*)"/g, (match, p1) => {
  const parts = p1.split(';').filter(i => i.trim() !== '');
  const obj = {};
  for (let p of parts) {
    const [k, v] = p.split(':');
    if (!k || !v) continue;
    let key = k.trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
    obj[key] = v.trim().replace(/'/g, '"');
  }
  return `style={${JSON.stringify(obj)}}`;
});
// Self close unclosed img and input tags
jsx = jsx.replace(/<img([^>]*?)(?<!\/)>/gi, '<img$1 />');
jsx = jsx.replace(/<input([^>]*?)(?<!\/)>/gi, '<input$1 />');

const reactComponent = `import React from 'react';

export default function App() {
  return (
    <div className="bg-background text-on-surface font-body selection:bg-primary-fixed selection:text-on-primary-fixed-variant">
      ${jsx}
    </div>
  );
}
`;

fs.writeFileSync('e:\\AGRIPRIME\\src\\App.jsx', reactComponent);
console.log("App.jsx created successfully");
