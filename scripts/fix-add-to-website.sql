-- Fix add_to_website column in aa4_category_db table
-- Converts string values to proper INT format
-- This script handles cases where add_to_website is stored as VARCHAR instead of INT

-- Step 1: Convert string values to integers
-- Handle cases where the value is stored as a string (e.g., "0", "1")
UPDATE `aa4_category_db`
SET `add_to_website` = CAST(`add_to_website` AS UNSIGNED)
WHERE `add_to_website` IS NOT NULL 
  AND `add_to_website` != ''
  AND `add_to_website` REGEXP '^[0-9]+$';

-- Step 2: Set NULL values to default value of 1 (matching Prisma schema default)
UPDATE `aa4_category_db`
SET `add_to_website` = 1
WHERE `add_to_website` IS NULL OR `add_to_website` = '';

-- Step 3: Ensure column type is INT and nullable (matching Prisma schema: Int?)
ALTER TABLE `aa4_category_db` 
MODIFY COLUMN `add_to_website` INT NULL DEFAULT 1;

-- Verify the fix (optional - uncomment to check)
-- SELECT id, cat_name, add_to_website FROM `aa4_category_db` LIMIT 10;
