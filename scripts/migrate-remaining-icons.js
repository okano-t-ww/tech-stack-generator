const fs = require('fs');
const path = require('path');

const migrations = {
  'devicon:codepen': 'logos:codepen',
  'devicon:mobx': 'logos:mobx',
  'devicon:vala': 'skill-icons:vala',
  // digitalocean, neo, nim, pytest, regex - keep as devicon (no alternatives)
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
    console.log(`✓ ${oldIcon} → ${newIcon}`);
  }
}

fs.writeFileSync(techStackFile, content);
console.log(`\nMigrated ${changeCount} more icons`);
