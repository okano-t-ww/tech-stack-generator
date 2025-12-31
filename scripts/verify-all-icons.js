const fs = require('fs');
const path = require('path');

// Read techStackData.ts
const techStackFile = path.join(__dirname, '../src/entities/tech/model/techStackData.ts');
const content = fs.readFileSync(techStackFile, 'utf8');

// Extract all iconify entries
const iconifyRegex = /iconify: "([^"]+)"/g;
const icons = [];
let match;

while ((match = iconifyRegex.exec(content)) !== null) {
  icons.push(match[1]);
}

// Get unique icons
const uniqueIcons = [...new Set(icons)];

console.log(`Found ${uniqueIcons.length} unique icons. Checking availability...\n`);

async function checkIcon(iconId) {
  const url = `https://api.iconify.design/${iconId}.svg`;
  try {
    const response = await fetch(url);
    return response.ok;
  } catch {
    return false;
  }
}

async function verifyAll() {
  const results = [];

  for (const icon of uniqueIcons.sort()) {
    const isAvailable = await checkIcon(icon);
    results.push({ icon, isAvailable });

    if (!isAvailable) {
      console.log(`❌ ${icon} - NOT FOUND`);
    }
  }

  const broken = results.filter(r => !r.isAvailable);

  console.log(`\nTotal icons checked: ${uniqueIcons.length}`);
  console.log(`Available: ${results.length - broken.length}`);
  console.log(`Broken: ${broken.length}`);

  if (broken.length > 0) {
    console.log(`\nBroken icons:`);
    broken.forEach(r => console.log(`  - ${r.icon}`));
  }
}

verifyAll();
