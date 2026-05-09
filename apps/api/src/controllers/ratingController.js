const ratingService = require('../services/ratingService');

const createRating = async (req, res, next) => {
  try {
    const rating = await ratingService.createRating({
      deal_id: req.body.deal_id,
      rater_id: req.user.id,
      rated_user_id: req.body.rated_user_id,
      score: req.body.score,
      comment: req.body.comment,
    });

    res.status(201).json(rating);
  } catch (error) {
    next(error);
  }
};

const getUserRatings = async (req, res, next) => {
  try {
    const ratings = await ratingService.getUserRatings(req.params.userId);
    res.status(200).json(ratings);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRating,
  getUserRatings,
};