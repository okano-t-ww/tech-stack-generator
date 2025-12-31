const fs = require('fs');
const path = require('path');

// Read techStackData.ts
const techStackFile = path.join(__dirname, '../src/entities/tech/model/techStackData.ts');
let content = fs.readFileSync(techStackFile, 'utf8');

// Extract all non-logos icons
const iconifyRegex = /"([^"]+)":\s*{[^}]*iconify: "(?!logos:)([^"]+)"/g;
const nonLogos = new Map();
let match;

while ((match = iconifyRegex.exec(content)) !== null) {
  const techId = match[1];
  const iconId = match[2];
  nonLogos.set(techId, iconId);
}

console.log(`Found ${nonLogos.size} technologies NOT using logos:\n`);

const techIds = Array.from(nonLogos.keys());
for (const techId of techIds) {
  console.log(`  ${techId} → ${nonLogos.get(techId)}`);
}

console.log(`\nRemoving all ${nonLogos.size} technologies...\n`);

// Remove each technology
let removeCount = 0;
for (const techId of techIds) {
  // Match the entire tech entry including comma
  const regex = new RegExp(`,?\\s*"${techId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}":\\s*\\{[^}]+\\}`, 'g');
  const matches = content.match(regex);

  if (matches) {
    content = content.replace(regex, '');
    removeCount++;
    console.log(`✓ Removed ${techId}`);
  }
}

fs.writeFileSync(techStackFile, content);
console.log(`\nRemoved ${removeCount} technologies not using logos`);
