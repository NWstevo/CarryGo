const dealService = require('../services/dealService');

const createDeal = async (req, res, next) => {
  try {
    const deal = await dealService.createDeal({
      connection_id: req.body.connection_id,
      current_user_id: req.user.id,
    });

    res.status(201).json(deal);
  } catch (error) {
    next(error);
  }
};

const getDeals = async (req, res, next) => {
  try {
    const deals = await dealService.getDeals(req.user.id);
    res.status(200).json(deals);
  } catch (error) {
    next(error);
  }
};

const updateDealStatus = async (req, res, next) => {
  try {
    const deal = await dealService.updateDealStatus({
      deal_id: req.params.id,
      new_status: req.body.status,
      current_user_id: req.user.id,
    });

    res.status(200).json(deal);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createDeal,
  getDeals,
  updateDealStatus,
};
