import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Fixes add_to_website column issues in the Category table
 * Converts string values (e.g., "0", "1") to proper INT format
 * Also ensures column type is INT NULL DEFAULT 1 as per Prisma schema
 */
async function fixAddToWebsite() {
  try {
    console.log("Starting add_to_website column fix...");

    // Step 1: Convert string values to integers
    // Handle cases where the value is stored as a string (e.g., "0", "1")
    const convertResult = await prisma.$executeRawUnsafe(`
      UPDATE aa4_category_db
      SET add_to_website = CAST(add_to_website AS UNSIGNED)
      WHERE add_to_website IS NOT NULL 
        AND add_to_website != ''
        AND add_to_website REGEXP '^[0-9]+$'
    `);

    console.log(
      `Fixed ${convertResult} add_to_website values (converted strings to integers)`
    );

    // Step 2: Set NULL/empty values to default value of 1 (matching Prisma schema default)
    const defaultResult = await prisma.$executeRawUnsafe(`
      UPDATE aa4_category_db
      SET add_to_website = 1
      WHERE add_to_website IS NULL OR add_to_website = ''
    `);

    console.log(`Set ${defaultResult} NULL/empty values to default (1)`);

    // Step 3: Ensure column type is INT and nullable (matching Prisma schema: Int?)
    await prisma.$executeRawUnsafe(`
      ALTER TABLE aa4_category_db 
      MODIFY COLUMN add_to_website INT NULL DEFAULT 1
    `);

    console.log(
      "✅ add_to_website column type verified/updated to INT NULL DEFAULT 1"
    );

    // Verify the fix
    const sampleCategories = await prisma.$queryRawUnsafe(`
      SELECT id, cat_name, add_to_website 
      FROM aa4_category_db 
      LIMIT 5
    `);

    console.log("\nSample categories after fix:");
    console.log(JSON.stringify(sampleCategories, null, 2));

    console.log("\n✅ add_to_website column fix completed successfully!");
  } catch (error) {
    console.error("❌ Error fixing add_to_website column:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the fix
fixAddToWebsite()
  .then(() => {
    console.log("Script completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Script failed:", error);
    process.exit(1);
  });
