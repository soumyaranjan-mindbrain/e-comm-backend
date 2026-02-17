-- Fix date format in aa4_category_db table
-- Converts string dates (YYYY-MM-DD or DD-MM-YYYY) to proper DATETIME format
-- This script handles cases where dates are stored as VARCHAR instead of DATETIME

-- Step 1: Check and convert insert_date column type if needed
-- First, convert string values to DATETIME format

-- Handle YYYY-MM-DD format (e.g., "2025-10-14")
UPDATE `aa4_category_db`
SET `insert_date` = STR_TO_DATE(`insert_date`, '%Y-%m-%d')
WHERE `insert_date` IS NOT NULL 
  AND `insert_date` != ''
  AND `insert_date` REGEXP '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
  AND STR_TO_DATE(`insert_date`, '%Y-%m-%d') IS NOT NULL;

-- Handle DD-MM-YYYY format (e.g., "14-10-2025")
UPDATE `aa4_category_db`
SET `insert_date` = STR_TO_DATE(`insert_date`, '%d-%m-%Y')
WHERE `insert_date` IS NOT NULL 
  AND `insert_date` != ''
  AND `insert_date` REGEXP '^[0-9]{2}-[0-9]{2}-[0-9]{4}$'
  AND STR_TO_DATE(`insert_date`, '%d-%m-%Y') IS NOT NULL;

-- Step 2: Ensure column type is DATETIME(3)
-- This will convert VARCHAR to DATETIME if needed
ALTER TABLE `aa4_category_db` 
MODIFY COLUMN `insert_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- Fix update_date column if it has the same issue
-- Handle YYYY-MM-DD format
UPDATE `aa4_category_db`
SET `update_date` = STR_TO_DATE(`update_date`, '%Y-%m-%d')
WHERE `update_date` IS NOT NULL 
  AND `update_date` != ''
  AND `update_date` REGEXP '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
  AND STR_TO_DATE(`update_date`, '%Y-%m-%d') IS NOT NULL;

-- Handle DD-MM-YYYY format
UPDATE `aa4_category_db`
SET `update_date` = STR_TO_DATE(`update_date`, '%d-%m-%Y')
WHERE `update_date` IS NOT NULL 
  AND `update_date` != ''
  AND `update_date` REGEXP '^[0-9]{2}-[0-9]{2}-[0-9]{4}$'
  AND STR_TO_DATE(`update_date`, '%d-%m-%Y') IS NOT NULL;

-- Ensure update_date column type is DATETIME(3)
ALTER TABLE `aa4_category_db` 
MODIFY COLUMN `update_date` DATETIME(3) NULL;

-- Verify the fix (optional - uncomment to check)
-- SELECT id, cat_name, insert_date, update_date FROM `aa4_category_db` LIMIT 10;
