const pool = require('../config/db');

const createDeal = async ({ trip_id, request_id, current_user_id }) => {
   
  const tripResult = await pool.query(
    'SELECT * FROM trips WHERE id = $1',
    [trip_id]
  );

  const requestResult = await pool.query(
    'SELECT * FROM requests WHERE id = $1',
    [request_id]
  );

  const trip = tripResult.rows[0];
  const request = requestResult.rows[0];

  if (!trip) {
    throw new Error('Trip not found');
  }

  if (!request) {
    throw new Error('Request not found');
  }

const userIsTraveler = trip.traveler_id === current_user_id;
const userIsSender = request.sender_id === current_user_id;

if (!userIsTraveler && !userIsSender) {
  throw new Error('You are not allowed to create a deal for this trip and request');
}

const isSelfDeal = trip.traveler_id === request.sender_id;

if (isSelfDeal) {
  throw new Error('You cannot create a deal with your own trip and request');
}

const existingDeal = await pool.query(
  'SELECT * FROM deals WHERE trip_id = $1 AND request_id = $2',
  [trip_id, request_id]
);

  if (existingDeal.rows.length > 0) {
    throw new Error('A deal already exists for this trip and request');
  }

  const result = await pool.query(
    `INSERT INTO deals (trip_id, request_id, traveler_id, sender_id, status)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [trip_id, request_id, trip.traveler_id, request.sender_id, 'pending']
  );

  return result.rows[0];
};

const getDeals = async () => {
  const result = await pool.query(
    `SELECT deals.*, 
            trips.origin AS trip_origin,
            trips.destination AS trip_destination,
            requests.item_name,
            traveler.full_name AS traveler_name,
            sender.full_name AS sender_name
     FROM deals
     JOIN trips ON deals.trip_id = trips.id
     JOIN requests ON deals.request_id = requests.id
     JOIN users AS traveler ON deals.traveler_id = traveler.id
     JOIN users AS sender ON deals.sender_id = sender.id
     ORDER BY deals.created_at DESC`
  );

  return result.rows;
};
const updateDealStatus = async ({ deal_id, new_status, current_user_id }) => {
  const result = await pool.query(
    'SELECT * FROM deals WHERE id = $1',
    [deal_id]
  );

  const deal = result.rows[0];

  if (!deal) {
    throw new Error('Deal not found');
  }

  const isTraveler = deal.traveler_id === current_user_id;
  const isSender = deal.sender_id === current_user_id;

  if (!isTraveler && !isSender) {
    throw new Error('You are not allowed to update this deal');
  }

  const updated = await pool.query(
    `UPDATE deals
     SET status = $1
     WHERE id = $2
     RETURNING *`,
    [new_status, deal_id]
  );

  return updated.rows[0];
};

module.exports = { createDeal, getDeals, updateDealStatus };