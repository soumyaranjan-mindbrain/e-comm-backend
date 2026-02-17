import { faker } from "@faker-js/faker";
import {
  PrismaClient,
  aa4_category_db_status,
  aa4_category_db_add_to_website,
  aa13_customer_db_status,
  x1_app_product_register_is_display,
  caa1_shop_stock_item_db_status,
  x2_app_product_img_register_status
} from "@prisma/client";

const prisma = new PrismaClient();

const categoryData = [
  { name: "GARMENTS", desc: "Cloths" },
  { name: "GROCERY", desc: "grocery items" },
  { name: "TOYS", desc: "Toys" },
  { name: "SHOES", desc: "Shoes" },
  { name: "ELECTRONICS", desc: "Latest gadgets" },
];

async function main() {
  console.log("🌱 Starting Database Seeding (Office Schema - Enums Fixed)...");

  // 1. Clean up (Be careful with order due to FKs)
  await prisma.shopStockItem.deleteMany({});
  await prisma.productImageRegister.deleteMany({});
  await prisma.productRating.deleteMany({});
  await prisma.productRegister.deleteMany({});
  await prisma.userAddress.deleteMany({});
  await prisma.customer.deleteMany({});
  await prisma.category.deleteMany({});

  // 2. Seed Categories
  const createdCategories = [];
  for (const item of categoryData) {
    const cat = await prisma.category.create({
      data: {
        catName: item.name,
        catCode: item.name.substring(0, 3).toUpperCase(),
        catDesc: item.desc,
        disorder: 0,
        status: aa4_category_db_status.ONE,
        addToWebsite: aa4_category_db_add_to_website.ONE,
      },
    });
    createdCategories.push(cat);
  }

  // 3. Seed Customers
  for (let i = 0; i < 10; i++) {
    const customer = await prisma.customer.create({
      data: {
        fullName: faker.person.fullName(),
        contactNo: i === 0 ? "1234567890" : faker.string.numeric(10),
        emailId: faker.internet.email(),
        status: aa13_customer_db_status.ONE,
      },
    });

    await prisma.userAddress.create({
      data: {
        userId: customer.id,
        address: faker.location.streetAddress(),
        townCity: faker.location.city(),
        pincode: faker.string.numeric(6),
        receiversName: customer.fullName,
        receiversNumber: customer.contactNo,
        saveAs: "Home",
      },
    });
  }

  // 4. Seed Products and Stock
  const products = [];
  for (let i = 0; i < 15; i++) {
    const productId = 5000 + i;
    const cat = faker.helpers.arrayElement(createdCategories);

    // Ensure productId is unique
    const uniqueProductId = productId;

    const product = await prisma.productRegister.create({
      data: {
        productName: faker.commerce.productName(),
        productId: uniqueProductId,
        shdesc: faker.commerce.productDescription(),
        displaySection: faker.helpers.arrayElement(["Fashion", "Trending", "Featured"]),
        isDisplay: x1_app_product_register_is_display.ONE,
        ratings: 4.5,
      },
    });
    products.push(product);

    // Stock & Price
    const mrp = parseFloat(faker.commerce.price({ min: 100, max: 2000 }));
    // shopId and partyId are often required in real logic but nullable in schema
    await prisma.shopStockItem.create({
      data: {
        itemId: uniqueProductId,
        itemName: product.productName,
        catId: cat.id,
        catName: cat.catName,
        mrpRate: mrp.toString(),
        saleRate: mrp * 0.8,
        curQty: 100,
        status: caa1_shop_stock_item_db_status.ONE,
        indate: new Date(),
      },
    });

    // Images
    await prisma.productImageRegister.create({
      data: {
        productId: uniqueProductId,
        proimgs: `https://images.unsplash.com/photo-${faker.number.int({ min: 1000000, max: 2000000 })}?q=80&w=500`,
        status: x2_app_product_img_register_status.ONE,
      },
    });
  }

  console.log("✅ Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
