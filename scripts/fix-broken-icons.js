const fs = require('fs');
const path = require('path');

const fixes = {
  'logos:elixir': 'devicon:elixir',
  'logos:matlab': 'devicon:matlab',
  'logos:powershell': 'devicon:powershell',
  'logos:circleci-icon': 'logos:circleci',
  'logos:playwright-icon': 'logos:playwright',
  'logos:sanity-icon': 'logos:sanity',
  'logos:discordjs': 'logos:discord',
  'logos:robloxstudio': 'skill-icons:robloxstudio',
};

const techStackFile = path.join(__dirname, '../src/entities/tech/model/techStackData.ts');
let content = fs.readFileSync(techStackFile, 'utf8');

let changeCount = 0;

for (const [broken, fixed] of Object.entries(fixes)) {
  const regex = new RegExp(`iconify: "${broken.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'g');
  const matches = content.match(regex);
  if (matches) {
    content = content.replace(regex, `iconify: "${fixed}"`);
    changeCount += matches.length;
    console.log(`✓ ${broken} → ${fixed}`);
  }
}

fs.writeFileSync(techStackFile, content);
console.log(`\nFixed ${changeCount} broken icons`);
