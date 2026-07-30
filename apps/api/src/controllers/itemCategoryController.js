const itemCategoryService = require('../services/itemCategoryService');

const getCategories = async (req, res, next) => {
  try {
    const categories = await itemCategoryService.listCategories();
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

module.exports = { getCategories };
