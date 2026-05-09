const pool = require('../config/db');

const createRequest = async ({
  sender_id,
  origin,
  destination,
  target_date,
  item_name,
  item_weight,
  budget,
}) => {
  const result = await pool.query(
    `INSERT INTO requests (sender_id, origin, destination, target_date, item_name, item_weight, budget)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      sender_id,
      origin.trim(),
      destination.trim(),
      target_date,
      item_name.trim(),
      item_weight,
      budget,
    ]
  );

  return result.rows[0];
};

const getRequests = async () => {
  const result = await pool.query(
    `SELECT requests.*, users.full_name AS sender_name
     FROM requests
     JOIN users ON requests.sender_id = users.id
     ORDER BY requests.created_at DESC`
  );

  return result.rows;
};

module.exports = { createRequest, getRequests };