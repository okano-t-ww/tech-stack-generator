const fs = require('fs');
const path = require('path');

// 既存のconstantsファイルを読み込み
const constantsPath = path.join(__dirname, '../src/constants/index.ts');
const enumsPath = path.join(__dirname, '../src/enums/index.ts');

const constantsContent = fs.readFileSync(constantsPath, 'utf-8');
const enumsContent = fs.readFileSync(enumsPath, 'utf-8');

// SkillIconsId enumから文字列値を抽出
const idMap = {};
const enumMatches = enumsContent.matchAll(/(\w+)\s*=\s*"([^"]+)"/g);
for (const match of enumMatches) {
  idMap[match[1]] = match[2];
}

console.log(`Loaded ${Object.keys(idMap).length} enum mappings`);

// 配列部分を抽出
const arrayMatch = constantsContent.match(/SKILL_ICONS_LIST:\s*TechSchema\[\]\s*=\s*\[([\s\S]+)\];/);
if (!arrayMatch) {
  console.error('Failed to extract array');
  process.exit(1);
}

const arrayContent = arrayMatch[1];

// オブジェクトを抽出（複数行対応・柔軟な空白処理）
const techItems = [];

// 改良版正規表現: 改行を含む場合も対応
const objectRegex = /\{\s*id:\s*SkillIconsId\.(\w+)\s*,\s*name:\s*"([^"]+)"\s*,\s*category:\s*TechCategory\.(\w+)\s*\}/gs;

let match;
while ((match = objectRegex.exec(arrayContent)) !== null) {
  const enumKey = match[1];
  const name = match[2];
  const category = match[3].toLowerCase();
  const id = idMap[enumKey];

  if (id) {
    techItems.push({ id, name, category });
  } else {
    console.warn(`⚠️  Missing ID mapping for ${enumKey}`);
  }
}

console.log(`✅ Converted ${techItems.length} tech items`);

if (techItems.length < 200) {
  console.error(`❌ Expected ~236 items but got ${techItems.length}`);
  console.log('\nTrying alternative parsing method...\n');

  // 代替方法: 行ごとに処理
  const lines = arrayContent.split('\n');
  const altItems = [];
  let currentItem = {};

  for (const line of lines) {
    const idMatch = line.match(/id:\s*SkillIconsId\.(\w+)/);
    const nameMatch = line.match(/name:\s*"([^"]+)"/);
    const catMatch = line.match(/category:\s*TechCategory\.(\w+)/);

    if (idMatch) currentItem.enumKey = idMatch[1];
    if (nameMatch) currentItem.name = nameMatch[1];
    if (catMatch) {
      currentItem.category = catMatch[1].toLowerCase();

      // アイテム完成
      if (currentItem.enumKey && currentItem.name) {
        const id = idMap[currentItem.enumKey];
        if (id) {
          altItems.push({
            id,
            name: currentItem.name,
            category: currentItem.category
          });
        }
      }
      currentItem = {};
    }
  }

  console.log(`📦 Alternative method found ${altItems.length} items`);

  if (altItems.length > techItems.length) {
    console.log('✅ Using alternative method results');
    techItems.length = 0;
    techItems.push(...altItems);
  }
}

console.log(`\n📊 Final count: ${techItems.length} items`);
console.log('First 3:', JSON.stringify(techItems.slice(0, 3), null, 2));
console.log('Last 3:', JSON.stringify(techItems.slice(-3), null, 2));

// カテゴリの大文字変換
const capitalizeCategory = (cat) => {
  const mapping = {
    'language': 'Language',
    'framework': 'Framework',
    'library': 'Library',
    'platform': 'Platform',
    'cloud': 'Cloud',
    'database': 'Database',
    'cicd': 'CICD',
    'buildtool': 'BuildTool',
    'other': 'Other',
  };
  return mapping[cat] || cat;
};

// ファイル生成
const itemsString = techItems.map(item =>
  `  { id: "${item.id}", name: "${item.name}", category: TechCategory.${capitalizeCategory(item.category)} }`
).join(',\n');

const newContent = `import { TechCategory, type TechItem } from "@/types/tech";

/**
 * 技術スタック一覧
 * Simple Icons / Devicon のIDをベースとした技術項目リスト
 *
 * 合計: ${techItems.length}項目
 */
export const TECH_STACK_LIST: TechItem[] = [
${itemsString}
];
`;

const outputPath = path.join(__dirname, '../src/constants/techStack.ts');
fs.writeFileSync(outputPath, newContent);
console.log(`\n✅ Generated: ${outputPath}`);
console.log(`📝 Total items: ${techItems.length}`);
