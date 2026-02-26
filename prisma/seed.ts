import { faker } from "@faker-js/faker";
import {
  PrismaClient,
  aa4_category_db_status,
  aa4_category_db_add_to_website,
  aa13_customer_db_status,
  x1_app_product_register_is_display,
  caa1_shop_stock_item_db_status,
  x2_app_product_img_register_status,
  x7_app_users_coupon_code_status,
} from "@prisma/client";

const prisma = new PrismaClient();

const categoryData = [
  { name: "GARMENTS", desc: "Latest fashion and trendy cloths" },
  { name: "GROCERY", desc: "Daily essentials and fresh grocery items" },
  { name: "TOYS", desc: "Fun and educational toys for all ages" },
  { name: "SHOES", desc: "Comfortable and stylish footwear" },
  { name: "ELECTRONICS", desc: "Latest gadgets, phones and accessories" },
  { name: "BEAUTY", desc: "Personal care and beauty products" },
  { name: "HOME & LIFESTYLE", desc: "Everything for your home" },
];

async function main() {
  console.log("🌱 Checking database state...");

  // 1. Check if database already has data
  const customerCount = await prisma.customer.count();
  if (customerCount > 0) {
    console.log(`✅ Database already has ${customerCount} customers. Skipping seeding to protect existing data.`);
    return;
  }

  console.log("🌱 Starting Database Seeding (Empty DB detected)...");

  // 2. Clear existing data (in case of partial data)
  console.log("🧹 Cleaning up old data if any...");
  await prisma.coinTransaction.deleteMany();
  await prisma.x12_app_user_bm_coins.deleteMany();
  await prisma.orderReturn.deleteMany();
  await prisma.x10_app_order_status.deleteMany();
  await prisma.x11_app_payment_details.deleteMany();
  await prisma.x9_app_order_details.deleteMany();
  await prisma.x8_app_orders_master.deleteMany();
  await prisma.x5_app_cart.deleteMany();
  await prisma.x7_app_users_coupon_code.deleteMany();
  await prisma.couponCode.deleteMany();
  await prisma.productRating.deleteMany();
  await prisma.userAddress.deleteMany();
  await prisma.shopStockItem.deleteMany();
  await prisma.productImageRegister.deleteMany();
  await prisma.productRegister.deleteMany();
  await prisma.category.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.coinConfig.deleteMany();

  console.log("✅ Cleanup complete.");

  // 2. Seed CoinConfig
  console.log("💰 Seeding CoinConfig...");
  await prisma.coinConfig.create({
    data: {
      versionNumber: 1,
      minEligibleAmount: 100,
      maxEligibleAmount: 10000,
      rewardPercentMin: 1,
      rewardPercentMax: 5,
      maxCoinsPerOrder: 500,
      redeemPercentLimit: 20,
      returnPeriodDays: 7,
      isActive: true,
    },
  });

  // 3. Seed Categories
  console.log("📁 Seeding Categories...");
  const createdCategories = [];
  for (let i = 0; i < categoryData.length; i++) {
    const item = categoryData[i];
    const cat = await prisma.category.create({
      data: {
        comId: 1,
        catName: item.name,
        catCode: item.name.substring(0, 3).toUpperCase(),
        catDesc: item.desc,
        categoryImage: `https://loremflickr.com/320/240/${item.name.toLowerCase().replace(/ & /g, ',')},shopping?lock=${i}`,
        disorder: i,
        status: aa4_category_db_status.ONE,
        addToWebsite: aa4_category_db_add_to_website.ONE,
      },
    });
    createdCategories.push(cat);
  }

  // 4. Seed Customers & Addresses
  console.log("👥 Seeding Customers...");
  const customers = [];
  for (let i = 0; i < 20; i++) {
    const customer = await prisma.customer.create({
      data: {
        comId: 1000 + i,
        fullName: faker.person.fullName(),
        contactNo: i === 0 ? "1234567890" : faker.string.numeric(10),
        emailId: faker.internet.email(),
        status: aa13_customer_db_status.ONE,
        coinBalance: faker.number.int({ min: 0, max: 1000 }),
      },
    });
    customers.push(customer);

    // Add 1-2 addresses for each customer
    const addressCount = faker.number.int({ min: 1, max: 2 });
    for (let j = 0; j < addressCount; j++) {
      await prisma.userAddress.create({
        data: {
          userId: customer.id,
          address: faker.location.streetAddress(true),
          townCity: faker.location.city(),
          state: faker.location.state(),
          pincode: faker.string.numeric(6),
          receiversName: customer.fullName,
          receiversNumber: customer.contactNo,
          saveAs: j === 0 ? "Home" : "Office",
          isDefault: j === 0,
        },
      });
    }
  }

  // 5. Seed Coupon Codes
  console.log("🎟️ Seeding Coupon Codes...");
  const coupons = [];
  for (let i = 0; i < 5; i++) {
    const coupon = await prisma.couponCode.create({
      data: {
        name: `SAVE${(i + 1) * 10}`,
        description: `Get ${(i + 1) * 10}% off on your purchase`,
        termsConditions: "Valid for orders above 500. Maximum discount 200.",
        validDate: faker.date.future(),
        issuedQnty: 100,
        receivedQnty: faker.number.int({ min: 0, max: 50 }),
        userQnty: 1,
        validPrice: 500,
      },
    });
    coupons.push(coupon);
  }

  // 6. Seed Products, Stock, Images, and Ratings
  console.log("📦 Seeding Products and related data...");
  const products = [];
  for (let i = 0; i < 40; i++) {
    const productIdNum = 10000 + i;
    const cat = faker.helpers.arrayElement(createdCategories);

    const product = await prisma.productRegister.create({
      data: {
        comId: 1,
        productName: faker.commerce.productName(),
        productId: productIdNum,
        shdesc: faker.commerce.productDescription(),
        lgdesc: faker.lorem.paragraphs(3),
        keyFeatures: faker.lorem.sentences(5),
        displaySection: faker.helpers.arrayElement(["Fashion", "Trending", "Featured", "New Arrivals"]),
        isDisplay: x1_app_product_register_is_display.ONE,
        ratings: faker.number.float({ min: 3, max: 5, fractionDigits: 1 }),
        deliveryDays: faker.number.int({ min: 2, max: 7 }),
      },
    });
    products.push(product);

    // Stock
    const mrp = parseFloat(faker.commerce.price({ min: 100, max: 5000 }));
    await prisma.shopStockItem.create({
      data: {
        itemId: productIdNum,
        itemName: product.productName,
        catId: cat.id,
        catName: cat.catName,
        mrpRate: mrp.toString(),
        saleRate: mrp * 0.9,
        curQty: faker.number.int({ min: 10, max: 500 }),
        status: caa1_shop_stock_item_db_status.ONE,
        indate: new Date(),
        brandName: faker.company.name(),
      },
    });

    // Multiple Images
    const imgCount = faker.number.int({ min: 1, max: 4 });
    for (let k = 0; k < imgCount; k++) {
      await prisma.productImageRegister.create({
        data: {
          productId: productIdNum,
          proimgs: `https://loremflickr.com/640/480/product?lock=${i * 10 + k}`,
          status: x2_app_product_img_register_status.ONE,
        },
      });
    }

    // Ratings from random customers
    const ratingCount = faker.number.int({ min: 0, max: 5 });
    for (let r = 0; r < ratingCount; r++) {
      const randomCust = faker.helpers.arrayElement(customers);
      await prisma.productRating.create({
        data: {
          productId: productIdNum,
          givenRatings: faker.number.int({ min: 1, max: 5 }),
          message: faker.lorem.sentence(),
          createdBy: randomCust.id,
        },
      });
    }
  }

  // 7. Seed Cart for some users
  console.log("🛒 Seeding Cart items...");
  for (let i = 0; i < 10; i++) {
    const cust = customers[i];
    const cartItemsCount = faker.number.int({ min: 1, max: 4 });
    const selectedProducts = faker.helpers.arrayElements(products, cartItemsCount);

    for (const p of selectedProducts) {
      // Use upsert or try-catch for cart as it has unique constraint on comId_ItemId
      try {
        await prisma.x5_app_cart.create({
          data: {
            comId: cust.comId,
            ItemId: p.productId!,
            quantity: faker.number.int({ min: 1, max: 3 }),
          },
        });
      } catch (e) {
        // Skip duplicates
      }
    }
  }

  // 8. Seed Orders
  console.log("🧾 Seeding Orders...");
  for (let i = 0; i < 15; i++) {
    const cust = faker.helpers.arrayElement(customers);
    const orderIdStr = `ORD-${faker.string.alphanumeric(8).toUpperCase()}`;
    const productCount = faker.number.int({ min: 1, max: 3 });
    const orderProducts = faker.helpers.arrayElements(products, productCount);

    let totalAmount = 0;

    const orderMaster = await prisma.x8_app_orders_master.create({
      data: {
        order_id: orderIdStr,
        comId: cust.comId,
        total_amount: 0, // Will update below
        net_amount_payment_mode: faker.helpers.arrayElement(["UPI", "COD", "CARD"]),
      },
    });

    for (const p of orderProducts) {
      const price = faker.number.int({ min: 200, max: 2000 });
      const qty = faker.number.int({ min: 1, max: 2 });
      const net = price * qty;
      totalAmount += net;

      await prisma.x9_app_order_details.create({
        data: {
          order_id: orderIdStr,
          comId: cust.comId,
          product_id: p.productId,
          qnty: qty,
          rate: price,
          net_amount: net,
          gst_percent: 18,
        },
      });
    }

    // Update Master total
    await prisma.x8_app_orders_master.update({
      where: { id: orderMaster.id },
      data: { total_amount: totalAmount },
    });

    // Order Status
    await prisma.x10_app_order_status.create({
      data: {
        order_id: orderIdStr,
        order_status: "ORDER PLACED",
        comId: cust.comId,
        created_by: cust.id,
      },
    });

    // Payment Details
    await prisma.x11_app_payment_details.create({
      data: {
        order_id: orderIdStr,
        payment_mode: orderMaster.net_amount_payment_mode,
        payment_details: JSON.stringify({ txnId: faker.string.uuid(), status: "SUCCESS" }),
      },
    });

    // Possibly one return
    if (i === 0) {
      await prisma.orderReturn.create({
        data: {
          orderId: orderIdStr,
          productId: orderProducts[0].productId!,
          comId: cust.comId,
          returnReason: "Defective item",
          pickupDate: faker.date.soon(),
          refundAmount: totalAmount / 2,
          status: "PENDING",
        }
      });
    }
  }

  // 9. Seed Coin Transactions & User Coupons
  console.log("💎 Seeding Transactions and User Coupons...");
  for (let i = 0; i < 10; i++) {
    const cust = customers[i];

    // Some coin transactions
    await prisma.coinTransaction.create({
      data: {
        userId: cust.id,
        type: "EARN",
        amount: 50,
        status: "ACTIVE",
        creditDate: new Date(),
        configSnapshot: { version: 1 },
      },
    });

    // Some specific user coupons
    const coupon = faker.helpers.arrayElement(coupons);
    await prisma.x7_app_users_coupon_code.create({
      data: {
        user_id: cust.id,
        coupon_id: coupon.id,
        status: x7_app_users_coupon_code_status.ONE,
      },
    });

    // Coin summary entry
    await prisma.x12_app_user_bm_coins.create({
      data: {
        user_id: cust.id,
        total_coins: 100,
        used_coins: 50,
        net_bm_coins: 50
      }
    });
  }

  console.log("✅ Seeding complete successfully for all tables!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
