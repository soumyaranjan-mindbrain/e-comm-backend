import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Normalizes existing database data:
 * 1. Sets isDisplay to "1" for all NULL values
 * 2. Sets updatedAt to createdAt for records where updatedAt is NULL
 * 3. Ensures all timestamps are properly set
 */
async function normalizeProductData() {
  try {
    console.log("Starting data normalization...");

    // 1. Normalize isDisplay: Set NULL values to "1"
    const isDisplayResult = await prisma.$executeRawUnsafe(`
      UPDATE product_register
      SET is_display = '1'
      WHERE is_display IS NULL
    `);
    console.log(
      `✅ Updated ${isDisplayResult} product records: Set isDisplay NULL -> "1"`
    );

    // 2. Normalize ProductRegister updatedAt: Set NULL to createdAt
    const productRegisterUpdatedAtResult = await prisma.$executeRawUnsafe(`
      UPDATE product_register
      SET updated_at = created_at
      WHERE updated_at IS NULL
    `);
    console.log(
      `✅ Updated ${productRegisterUpdatedAtResult} product records: Set updatedAt NULL -> createdAt`
    );

    // 3. Normalize ProductImageRegister updatedAt: Set NULL to createdAt
    const productImageUpdatedAtResult = await prisma.$executeRawUnsafe(`
      UPDATE product_image_register
      SET updated_at = created_at
      WHERE updated_at IS NULL
    `);
    console.log(
      `✅ Updated ${productImageUpdatedAtResult} product image records: Set updatedAt NULL -> createdAt`
    );

    // 4. Normalize ProductRating updatedAt: Set NULL to createdAt
    const productRatingUpdatedAtResult = await prisma.$executeRawUnsafe(`
      UPDATE x3_app_product_ratings
      SET updated_at = created_at
      WHERE updated_at IS NULL
    `);
    console.log(
      `✅ Updated ${productRatingUpdatedAtResult} product rating records: Set updatedAt NULL -> createdAt`
    );

    // 5. Normalize UserAddress updatedAt: Set NULL to createdAt
    const userAddressUpdatedAtResult = await prisma.$executeRawUnsafe(`
      UPDATE x4_app_user_addresses
      SET updated_at = created_at
      WHERE updated_at IS NULL
    `);
    console.log(
      `✅ Updated ${userAddressUpdatedAtResult} user address records: Set updatedAt NULL -> createdAt`
    );

    // Verify the normalization
    const nullIsDisplayCount = await prisma.$queryRawUnsafe<
      Array<{ count: bigint }>
    >(`
      SELECT COUNT(*) as count
      FROM product_register
      WHERE is_display IS NULL
    `);
    console.log(
      `\n📊 Verification: ${nullIsDisplayCount[0].count} products with NULL isDisplay remaining (should be 0)`
    );

    const nullUpdatedAtCount = await prisma.$queryRawUnsafe<
      Array<{ count: bigint }>
    >(`
      SELECT 
        (SELECT COUNT(*) FROM product_register WHERE updated_at IS NULL) +
        (SELECT COUNT(*) FROM product_image_register WHERE updated_at IS NULL) +
        (SELECT COUNT(*) FROM x3_app_product_ratings WHERE updated_at IS NULL) +
        (SELECT COUNT(*) FROM x4_app_user_addresses WHERE updated_at IS NULL) as count
    `);
    console.log(
      `📊 Verification: ${nullUpdatedAtCount[0].count} records with NULL updatedAt remaining (should be 0)`
    );

    console.log("\n✅ Data normalization completed successfully!");
  } catch (error) {
    console.error("❌ Error normalizing data:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the normalization
normalizeProductData()
  .then(() => {
    console.log("Script completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Script failed:", error);
    process.exit(1);
  });
