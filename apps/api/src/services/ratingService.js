const pool = require('../config/db');

const createRating = async ({
  deal_id,
  rater_id,
  rated_user_id,
  score,
  comment
}) => {
  const dealResult = await pool.query(
    'SELECT * FROM deals WHERE id = $1',
    [deal_id]
  );

  const deal = dealResult.rows[0];

  if (!deal) {
    throw new Error('Deal not found');
  }

  if (deal.status !== 'completed') {
    throw new Error('You can only rate after the deal is completed');
  }

  const isParticipant =
    deal.traveler_id === rater_id || deal.sender_id === rater_id;

  if (!isParticipant) {
    throw new Error('You are not allowed to rate this deal');
  }

  const otherUser =
    deal.traveler_id === rater_id ? deal.sender_id : deal.traveler_id;

  if (rated_user_id !== otherUser) {
    throw new Error('You can only rate the other participant in this deal');
  }

  const result = await pool.query(
    `INSERT INTO ratings (deal_id, rater_id, rated_user_id, score, comment)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [deal_id, rater_id, rated_user_id, score, comment || null]
  );

  return result.rows[0];
};

const getUserRatings = async (user_id) => {
  const result = await pool.query(
    `SELECT ratings.*, users.full_name AS rater_name
     FROM ratings
     JOIN users ON ratings.rater_id = users.id
     WHERE ratings.rated_user_id = $1
     ORDER BY ratings.created_at DESC`,
    [user_id]
  );

  return result.rows;
};

module.exports = {
  createRating,
  getUserRatings,
};