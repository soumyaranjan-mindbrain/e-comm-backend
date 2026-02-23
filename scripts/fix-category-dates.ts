import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Fixes date format issues in the Category table
 * Converts string dates (YYYY-MM-DD or DD-MM-YYYY) to proper DateTime
 * Also ensures column types are DATETIME(3) as per Prisma schema
 */
async function fixCategoryDates() {
  try {
    console.log("Starting date format fix...");

    // Fix insert_date column - Handle YYYY-MM-DD format (e.g., "2025-10-14")
    const insertDateResult1 = await prisma.$executeRawUnsafe(`
      UPDATE aa4_category_db
      SET insert_date = STR_TO_DATE(insert_date, '%Y-%m-%d')
      WHERE insert_date IS NOT NULL 
        AND insert_date != ''
        AND insert_date REGEXP '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
        AND STR_TO_DATE(insert_date, '%Y-%m-%d') IS NOT NULL
    `);

    console.log(
      `Fixed ${insertDateResult1} insert_date values (YYYY-MM-DD format)`,
    );

    // Fix insert_date column - Handle DD-MM-YYYY format (e.g., "14-10-2025")
    const insertDateResult2 = await prisma.$executeRawUnsafe(`
      UPDATE aa4_category_db
      SET insert_date = STR_TO_DATE(insert_date, '%d-%m-%Y')
      WHERE insert_date IS NOT NULL 
        AND insert_date != ''
        AND insert_date REGEXP '^[0-9]{2}-[0-9]{2}-[0-9]{4}$'
        AND STR_TO_DATE(insert_date, '%d-%m-%Y') IS NOT NULL
    `);

    console.log(
      `Fixed ${insertDateResult2} insert_date values (DD-MM-YYYY format)`,
    );

    // Ensure insert_date column type is DATETIME(3)
    await prisma.$executeRawUnsafe(`
      ALTER TABLE aa4_category_db 
      MODIFY COLUMN insert_date DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
    `);

    console.log("✅ insert_date column type verified/updated to DATETIME(3)");

    // Fix update_date column - Handle YYYY-MM-DD format
    const updateDateResult1 = await prisma.$executeRawUnsafe(`
      UPDATE aa4_category_db
      SET update_date = STR_TO_DATE(update_date, '%Y-%m-%d')
      WHERE update_date IS NOT NULL 
        AND update_date != ''
        AND update_date REGEXP '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
        AND STR_TO_DATE(update_date, '%Y-%m-%d') IS NOT NULL
    `);

    console.log(
      `Fixed ${updateDateResult1} update_date values (YYYY-MM-DD format)`,
    );

    // Fix update_date column - Handle DD-MM-YYYY format
    const updateDateResult2 = await prisma.$executeRawUnsafe(`
      UPDATE aa4_category_db
      SET update_date = STR_TO_DATE(update_date, '%d-%m-%Y')
      WHERE update_date IS NOT NULL 
        AND update_date != ''
        AND update_date REGEXP '^[0-9]{2}-[0-9]{2}-[0-9]{4}$'
        AND STR_TO_DATE(update_date, '%d-%m-%Y') IS NOT NULL
    `);

    console.log(
      `Fixed ${updateDateResult2} update_date values (DD-MM-YYYY format)`,
    );

    // Ensure update_date column type is DATETIME(3)
    await prisma.$executeRawUnsafe(`
      ALTER TABLE aa4_category_db 
      MODIFY COLUMN update_date DATETIME(3) NULL
    `);

    console.log("✅ update_date column type verified/updated to DATETIME(3)");

    // Verify the fix
    const sampleCategories = await prisma.$queryRawUnsafe(`
      SELECT id, cat_name, insert_date, update_date 
      FROM aa4_category_db 
      LIMIT 5
    `);

    console.log("\nSample categories after fix:");
    console.log(JSON.stringify(sampleCategories, null, 2));

    console.log("\n✅ Date format fix completed successfully!");
  } catch (error) {
    console.error("❌ Error fixing dates:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the fix
fixCategoryDates()
  .then(() => {
    console.log("Script completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Script failed:", error);
    process.exit(1);
  });
