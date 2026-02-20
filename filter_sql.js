const fs = require('fs');
const readline = require('readline');

const tablesToKeep = [
    'aa13_customer_db',
    'aa4_category_db',
    'x1_app_product_register',
    'x2_app_product_img_register',
    'x3_app_product_ratings',
    'x4_app_user_addresses',
    'x5_app_cart',
    'caa1_shop_stock_item_db',
    'x6_app_coupon_code'
];

async function filter() {
    const fileStream = fs.createReadStream('init_backup.sql');
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    const outputStream = fs.createWriteStream('init_clean.sql');
    outputStream.write('SET FOREIGN_KEY_CHECKS = 0;\n');
    outputStream.write('DROP DATABASE IF EXISTS ecommerce_app;\n');
    outputStream.write('CREATE DATABASE ecommerce_app;\n');
    outputStream.write('USE ecommerce_app;\n');

    let inTable = false;
    let currentTableName = '';

    for await (const line of rl) {
        if (line.includes('CREATE TABLE')) {
            const match = line.match(/CREATE TABLE `([^`]+)`/);
            if (match) {
                currentTableName = match[1];
                if (tablesToKeep.includes(currentTableName)) {
                    inTable = true;
                    outputStream.write(line + '\n');
                    continue;
                }
            }
        }

        if (inTable) {
            // Specifically fix aa13_customer_db to match data count (29 vs 30)
            if (currentTableName === 'aa13_customer_db' && line.includes('`profile_image`')) {
                console.log('Skipping profile_image in initial CREATE TABLE to match INSERT count...');
                // We skip this line
            } else {
                outputStream.write(line + '\n');
            }

            if (line.includes(') ENGINE=')) {
                inTable = false;
            }
            continue;
        }

        if (line.includes('INSERT INTO')) {
            const match = line.match(/INSERT INTO `([^`]+)`/);
            if (match) {
                const tableName = match[1];
                if (tablesToKeep.includes(tableName)) {
                    outputStream.write(line + '\n');
                }
            }
        }
    }

    // Add the profile_image column back AFTER data is inserted
    outputStream.write('\n-- Add missing profile_image column for mobile app logic\n');
    outputStream.write('ALTER TABLE `aa13_customer_db` ADD COLUMN IF NOT EXISTS `profile_image` varchar(255) DEFAULT NULL;\n');

    outputStream.write('SET FOREIGN_KEY_CHECKS = 1;\n');
    outputStream.end();
    console.log('Clean SQL generated: init_clean.sql');
}

filter();
