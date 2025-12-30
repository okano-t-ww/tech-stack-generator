const simpleIcons = require('simple-icons');

const skillIconsIds = [
  "ableton", "activitypub", "actix", "adonis", "ae", "alpinejs", "anaconda",
  "androidstudio", "angular", "ansible", "apollo", "apple", "appwrite", "arch",
  "arduino", "astro", "atom", "aws", "azure", "babel", "bash", "bevy",
  "bitbucket", "blender", "bootstrap", "bsd", "bun", "c", "cs", "cpp",
  "crystal", "cassandra", "clion", "clojure", "cloudflare", "cmake", "codepen",
  "coffeescript", "css", "cypress", "d3", "dart", "debian", "deno", "devto",
  "discord", "bots", "discordjs", "django", "docker", "dotnet", "dynamodb",
  "eclipse", "elasticsearch", "electron", "elixir", "elysia", "emacs", "ember",
  "emotion", "express", "fastapi", "fediverse", "figma", "firebase", "flask",
  "flutter", "gatsby", "gcp", "git", "github", "githubactions", "gitlab",
  "gmail", "go", "gradle", "godot", "grafana", "graphql", "gtk", "gulp",
  "haskell", "haxe", "haxeflixel", "heroku", "hibernate", "html", "htmx",
  "idea", "instagram", "java", "js", "jenkins", "jest", "jquery", "kafka",
  "kali", "kotlin", "ktor", "kubernetes", "laravel", "latex", "less", "linkedin",
  "linux", "lit", "lua", "md", "mastodon", "materialui", "matlab", "maven",
  "mint", "misskey", "mongodb", "mysql", "neovim", "nestjs", "netlify",
  "nextjs", "nginx", "nim", "nix", "nodejs", "notion", "npm", "nuxtjs",
  "obsidian", "ocaml", "opencv", "openshift", "openstack", "p5js", "perl",
  "php", "phpstorm", "pinia", "pkl", "planetscale", "pnpm", "postgres",
  "postman", "powershell", "prisma", "processing", "prometheus", "pug",
  "pycharm", "py", "pytorch", "qt", "r", "rabbitmq", "rails", "raspberrypi",
  "react", "reactivex", "redhat", "redis", "redux", "regex", "remix", "replit",
  "rider", "robloxstudio", "rocket", "rollupjs", "ros", "ruby", "rust", "sass",
  "spring", "sqlite", "stackoverflow", "styledcomponents", "sublime", "supabase",
  "scala", "sklearn", "selenium", "sentry", "sequelize", "sketchup", "solidity",
  "solidjs", "svelte", "svg", "swift", "symfony", "tailwind", "tauri",
  "tensorflow", "terraform", "threejs", "twitter", "ts", "ubuntu", "unity",
  "unreal", "v", "vala", "vercel", "vim", "visualstudio", "vite", "vitest",
  "vscode", "vscodium", "vue", "vuetify", "wasm", "webflow", "webpack",
  "webstorm", "windicss", "windows", "wordpress", "workers", "xd", "yarn",
  "yew", "zig"
];

const results = {
  found: [],
  notFound: [],
  mapping: {}
};

const allSimpleIconsKeys = Object.keys(simpleIcons).filter(key => key.startsWith('si'));

skillIconsIds.forEach(id => {
  const patterns = [
    `si${id.charAt(0).toUpperCase()}${id.slice(1)}`,
    `si${id.toUpperCase()}`,
    `si${id}`,
  ];

  const specialCases = {
    'nodejs': 'siNodedotjs',
    'nextjs': 'siNextdotjs',
    'nuxtjs': 'siNuxtdotjs',
    'vuejs': 'siVuedotjs',
    'cs': 'siCsharp',
    'ts': 'siTypescript',
    'js': 'siJavascript',
    'py': 'siPython',
    'postgres': 'siPostgresql',
    'gcp': 'siGooglecloud',
    'aws': 'siAmazonaws',
    'vscode': 'siVisualstudiocode',
    'ae': 'siAdobeaftereffects',
    'ai': 'siAdobeillustrator',
    'pr': 'siAdobepremierepro',
    'ps': 'siAdobephotoshop',
    'xd': 'siAdobexd',
    'rollupjs': 'siRollupdotjs',
    'p5js': 'siP5dotjs',
    'd3': 'siD3dotjs',
    'threejs': 'siThreedotjs',
    'discordjs': 'siDiscorddotjs',
    'materialui': 'siMui',
    'styledcomponents': 'siStyledcomponents',
  };

  if (specialCases[id]) {
    patterns.unshift(specialCases[id]);
  }

  let found = false;
  for (const pattern of patterns) {
    if (simpleIcons[pattern]) {
      results.found.push(id);
      results.mapping[id] = pattern.replace('si', '').toLowerCase();
      found = true;
      break;
    }
  }

  if (!found) {
    const fuzzyMatch = allSimpleIconsKeys.find(key =>
      key.toLowerCase().includes(id.toLowerCase())
    );

    if (fuzzyMatch) {
      results.found.push(id);
      results.mapping[id] = fuzzyMatch.replace('si', '').toLowerCase();
    } else {
      results.notFound.push(id);
    }
  }
});

console.log('=== Simple Icons Mapping Results ===\n');
console.log(`✅ Found: ${results.found.length}/${skillIconsIds.length}`);
console.log(`❌ Not Found: ${results.notFound.length}/${skillIconsIds.length}\n`);

if (results.notFound.length > 0) {
  console.log('Missing icons:');
  results.notFound.forEach(id => console.log(`  - ${id}`));
  console.log('');
}

console.log('Sample mappings:');
Object.entries(results.mapping).slice(0, 20).forEach(([skill, simple]) => {
  console.log(`  ${skill} → ${simple}`);
});

const fs = require('fs');
fs.writeFileSync(
  __dirname + '/icon-mapping.json',
  JSON.stringify(results.mapping, null, 2)
);
console.log('\n✅ Mapping saved to scripts/icon-mapping.json');
