import { TECH_STACK_LIST } from "../src/entities/tech/model/techStackData";
import { validateIconifyId } from "../src/entities/tech/model/types";

interface ValidationReport {
  total: number;
  valid: number;
  invalid: { id: string; iconify: string; error: string }[];
}

function validateIcons(): ValidationReport {
  const report: ValidationReport = {
    total: TECH_STACK_LIST.length,
    valid: 0,
    invalid: [],
  };

  TECH_STACK_LIST.forEach((item) => {
    try {
      validateIconifyId(item.iconify);
      report.valid++;
    } catch (error) {
      report.invalid.push({
        id: item.id,
        iconify: item.iconify,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  return report;
}

function main() {
  console.log("🔍 Validating Iconify icon IDs...\n");

  const report = validateIcons();

  console.log("=== Icon Validation Report ===\n");
  console.log(`📊 Total items:     ${report.total}`);
  console.log(`✅ Valid icons:     ${report.valid}`);
  console.log(`❌ Invalid icons:   ${report.invalid.length}\n`);

  if (report.invalid.length > 0) {
    console.log("=== Invalid Icon IDs ===\n");
    report.invalid.forEach(({ id, iconify, error }) => {
      console.log(`❌ ${id}`);
      console.log(`   Icon: ${iconify}`);
      console.log(`   Error: ${error}\n`);
    });

    console.log("\n💡 Icon IDs must be in format: prefix:icon-name");
    console.log("   Valid prefixes: logos, simple-icons, devicon");
    console.log("   Example: logos:react, simple-icons:vite\n");

    process.exit(1);
  } else {
    console.log("✅ All icon IDs are valid!\n");
    console.log("✨ Icon format validation passed.\n");
  }
}

main();
