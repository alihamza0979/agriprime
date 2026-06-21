const fs = require('fs');
const https = require('https');
const path = require('path');

const t1 = JSON.parse(fs.readFileSync('C:\\Users\\ranaa\\.gemini\\antigravity\\brain\\fefb7399-80e0-4649-85c1-2d8727c9516b\\.system_generated\\steps\\43\\output.txt','utf8'));
const t2 = JSON.parse(fs.readFileSync('C:\\Users\\ranaa\\.gemini\\antigravity\\brain\\fefb7399-80e0-4649-85c1-2d8727c9516b\\.system_generated\\steps\\53\\output.txt','utf8'));

const screens = [];
[t1, t2].forEach(t => {
  if(!t.results) return;
  t.results.forEach(r => {
    if(r.result && r.result.content && r.result.content[0].text) {
      const content = JSON.parse(r.result.content[0].text);
      if(content.outputComponents) {
        content.outputComponents.forEach(c => {
          if(c.design && c.design.screens) {
            c.design.screens.forEach(s => {
              if(s.htmlCode && s.htmlCode.downloadUrl) {
                screens.push({
                  name: s.title,
                  id: s.id,
                  url: s.htmlCode.downloadUrl
                });
              }
            });
          }
        });
      }
    }
  });
});

console.log(`Found ${screens.length} screens to download.`);

async function downloadHTML(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
      res.on('error', err => reject(err));
    }).on('error', err => reject(err));
  });
}

function processJSX(html) {
  let bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  let content = bodyMatch ? bodyMatch[1] : html;
  
  let jsx = content.replace(/class=/g, 'className=');
  jsx = jsx.replace(/<!--[\s\S]*?-->/g, (match) => {
    return '{/* ' + match.slice(4, -3).trim() + ' */}';
  });
  jsx = jsx.replace(/style="([^"]*)"/g, (match, p1) => {
    const parts = p1.split(';').filter(i => i.trim() !== '');
    const obj = {};
    for (let p of parts) {
      if(!p.includes(':')) continue;
      const [k, ...vParts] = p.split(':');
      const v = vParts.join(':');
      let key = k.trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
      obj[key] = v.trim().replace(/'/g, '"');
    }
    return `style={${JSON.stringify(obj)}}`;
  });
  
  jsx = jsx.replace(/<img([^>]*?)(?<!\/)>/gi, '<img$1 />');
  jsx = jsx.replace(/<input([^>]*?)(?<!\/)>/gi, '<input$1 />');
  jsx = jsx.replace(/<br([^>]*?)(?<!\/)>/gi, '<br$1 />');
  jsx = jsx.replace(/<hr([^>]*?)(?<!\/)>/gi, '<hr$1 />');

  // React SVG fixes
  jsx = jsx.replace(/stroke-width/g, 'strokeWidth');
  jsx = jsx.replace(/stroke-linecap/g, 'strokeLinecap');
  jsx = jsx.replace(/stroke-linejoin/g, 'strokeLinejoin');
  jsx = jsx.replace(/fill-rule/g, 'fillRule');
  jsx = jsx.replace(/clip-rule/g, 'clipRule');

  return jsx;
}

const outDir = path.join(__dirname, 'src', 'screens');
if(!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, {recursive: true});
}

async function run() {
  for (let s of screens) {
    try {
      console.log(`Downloading ${s.name}...`);
      const html = await downloadHTML(s.url);
      const jsx = processJSX(html);
      
      const compName = s.name.replace(/[^a-zA-Z0-9]/g, '');
      const reactComponent = `import React from 'react';

export default function ${compName}() {
  return (
    <>
      ${jsx}
    </>
  );
}
`;
      fs.writeFileSync(path.join(outDir, `${compName}.jsx`), reactComponent);
      console.log(`Saved ${compName}.jsx`);
    } catch(err) {
      console.error(`Failed to process ${s.name}`, err);
    }
  }
}

run();
