-- Post-init migrations: run after base init.sql and prisma db push
-- This file handles schema additions that aren't in the original init.sql

-- Add cancel_reason to x10_app_order_status (safe, idempotent)
SET @exists = (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'x10_app_order_status'
    AND COLUMN_NAME = 'cancel_reason'
);

SET @sql = IF(@exists = 0,
  'ALTER TABLE x10_app_order_status ADD COLUMN cancel_reason TEXT NULL AFTER order_status',
  'SELECT 1'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
