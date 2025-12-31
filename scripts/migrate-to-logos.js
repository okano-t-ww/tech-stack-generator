const fs = require('fs');
const path = require('path');

// devicon -> logos/skill-icons mapping
const migrations = {
  // Languages - C family (priority change)
  'devicon:c': 'logos:c',
  'devicon:cplusplus': 'logos:c-plusplus',
  'devicon:csharp': 'logos:c-sharp',
  
  // Other devicons that have logos equivalents
  'devicon:amazonwebservices': 'logos:aws',
  'devicon:azure': 'logos:azure',
  'devicon:composer': 'logos:composer',
  'devicon:elixir': 'logos:elixir',
  'devicon:matlab': 'logos:matlab',
  'devicon:neo': 'logos:neo4j',
  'devicon:powershell': 'logos:powershell',
  'devicon:vscode': 'logos:visual-studio-code',
  'devicon:visualstudio': 'logos:visual-studio',
  
  // These might have skill-icons equivalents
  'devicon:linkedin': 'skill-icons:linkedin',
  'devicon:twitter': 'skill-icons:twitter',
};

const techStackFile = path.join(__dirname, '../src/entities/tech/model/techStackData.ts');

let content = fs.readFileSync(techStackFile, 'utf8');
let changeCount = 0;

for (const [oldIcon, newIcon] of Object.entries(migrations)) {
  const regex = new RegExp(`iconify: "${oldIcon}"`, 'g');
  const matches = content.match(regex);
  if (matches) {
    content = content.replace(regex, `iconify: "${newIcon}"`);
    changeCount += matches.length;
    console.log(`✓ ${oldIcon} → ${newIcon} (${matches.length} occurrence(s))`);
  }
}

fs.writeFileSync(techStackFile, content);
console.log(`\nTotal: ${changeCount} icons migrated to logos/skill-icons`);
