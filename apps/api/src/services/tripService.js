const pool = require('../config/db');

const createTrip = async ({ traveler_id, origin, destination, departure_date, available_weight }) => {
  const cleanedOrigin = origin.trim();
  const cleanedDestination = destination.trim();
  const cleanedWeight = Number(available_weight);

  const existingTrip = await pool.query(
    `SELECT * FROM trips
     WHERE traveler_id = $1
       AND origin = $2
       AND destination = $3
       AND departure_date = $4
       AND available_weight = $5`,
    [traveler_id, cleanedOrigin, cleanedDestination, departure_date, cleanedWeight]
  );

  if (existingTrip.rows.length > 0) {
    throw new Error('You already created a trip with these exact details');
  }

  const result = await pool.query(
    `INSERT INTO trips (traveler_id, origin, destination, departure_date, available_weight)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [traveler_id, cleanedOrigin, cleanedDestination, departure_date, cleanedWeight]
  );

  return result.rows[0];
};

const getTrips = async () => {
  const result = await pool.query(
    `SELECT trips.*, users.full_name AS traveler_name
     FROM trips
     JOIN users ON trips.traveler_id = users.id
     WHERE trips.status = 'active'
     ORDER BY trips.created_at DESC`
  );

  return result.rows;
};

module.exports = { createTrip, getTrips };