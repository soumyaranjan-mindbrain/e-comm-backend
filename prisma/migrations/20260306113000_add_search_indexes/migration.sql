-- Improve lookup performance for search/auth flows without changing API behavior.
CREATE INDEX `idx_product_register_product_name`
  ON `x1_app_product_register`(`product_name`);

CREATE INDEX `idx_category_cat_name`
  ON `aa4_category_db`(`cat_name`);

CREATE INDEX `idx_customer_contact_no`
  ON `aa13_customer_db`(`contact_no`);
