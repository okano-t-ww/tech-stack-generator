const fs = require('fs');
const path = require('path');

const techsToRemove = ['eclipse', 'openshift', 'regex'];

const techStackFile = path.join(__dirname, '../src/entities/tech/model/techStackData.ts');
let content = fs.readFileSync(techStackFile, 'utf8');

for (const techId of techsToRemove) {
  // Match the entire tech entry including the comma before or after
  const regex = new RegExp(`,?\\s*"${techId}":\\s*{[^}]+}`, 'g');
  const match = content.match(regex);
  
  if (match) {
    content = content.replace(regex, '');
    console.log(`✓ Removed ${techId}`);
  }
}

fs.writeFileSync(techStackFile, content);
console.log(`\nRemoved ${techsToRemove.length} technologies with broken icons`);
