const brokenIcons = [
  'logos:elixir',
  'logos:matlab',
  'logos:powershell',
  'logos:circleci-icon',
  'logos:playwright-icon',
  'logos:sanity-icon',
  'logos:discordjs',
  'logos:eclipseide',
  'logos:redhatopenshift',
  'logos:robloxstudio',
];

async function findAlternative(broken) {
  const base = broken.split(':')[1].replace('-icon', '').replace('js', '');

  const variants = [
    // Try different prefixes
    `logos:${base}`,
    `devicon:${base}`,
    `skill-icons:${base}`,
    // Try with -icon suffix
    `logos:${base}-icon`,
    // Try without modifications
    broken.replace('logos:', 'devicon:'),
    broken.replace('logos:', 'skill-icons:'),
  ];

  for (const variant of variants) {
    const url = `https://api.iconify.design/${variant}.svg`;
    try {
      const response = await fetch(url);
      if (response.ok) {
        return variant;
      }
    } catch {}
  }

  return null;
}

async function main() {
  console.log('Finding alternatives for broken icons...\n');

  for (const broken of brokenIcons) {
    const alternative = await findAlternative(broken);
    if (alternative) {
      console.log(`${broken} → ${alternative}`);
    } else {
      console.log(`${broken} → NO ALTERNATIVE FOUND`);
    }
  }
}

main();
