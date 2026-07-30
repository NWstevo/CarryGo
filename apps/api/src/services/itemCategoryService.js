const pool = require('../config/db');

const listCategories = async () => {
  const result = await pool.query(
    'SELECT key, label, is_blocked FROM item_categories ORDER BY label ASC'
  );

  return result.rows;
};

const assertCategoryAllowed = async (categoryKey) => {
  const result = await pool.query(
    'SELECT key, is_blocked FROM item_categories WHERE key = $1',
    [categoryKey]
  );

  const category = result.rows[0];

  if (!category) {
    throw new Error('Unknown item category');
  }

  if (category.is_blocked) {
    throw new Error(`Items in the "${categoryKey}" category are not allowed on CarryGo`);
  }
};

module.exports = { listCategories, assertCategoryAllowed };
