const pool = require('../config/db');

const createDeal = async ({ connection_id, current_user_id }) => {
  const connectionResult = await pool.query(
    'SELECT * FROM connections WHERE id = $1',
    [connection_id]
  );

  const connection = connectionResult.rows[0];

  if (!connection) {
    throw new Error('Connection not found');
  }

  const isParticipant =
    connection.initiator_id === current_user_id ||
    connection.receiver_id === current_user_id;

  if (!isParticipant) {
    throw new Error('You are not allowed to create a deal from this connection');
  }

  if (connection.status !== 'accepted') {
    throw new Error('Deal can only be created from an accepted connection');
  }

  const existingDeal = await pool.query(
    'SELECT * FROM deals WHERE connection_id = $1',
    [connection_id]
  );

  if (existingDeal.rows.length > 0) {
    throw new Error('A deal already exists for this connection');
  }

  let trip_id = null;
  let request_id = null;
  let traveler_id = null;
  let sender_id = null;

  if (connection.trip_id) {
    const tripResult = await pool.query(
      'SELECT * FROM trips WHERE id = $1',
      [connection.trip_id]
    );

    const trip = tripResult.rows[0];

    if (!trip) {
      throw new Error('Related trip not found');
    }

    trip_id = trip.id;
    traveler_id = trip.traveler_id;

    sender_id =
      connection.initiator_role === 'sender'
        ? connection.initiator_id
        : connection.receiver_id;
  }

  if (connection.request_id) {
    const requestResult = await pool.query(
      'SELECT * FROM requests WHERE id = $1',
      [connection.request_id]
    );

    const request = requestResult.rows[0];

    if (!request) {
      throw new Error('Related request not found');
    }

    request_id = request.id;
    sender_id = request.sender_id;

    traveler_id =
      connection.initiator_role === 'traveler'
        ? connection.initiator_id
        : connection.receiver_id;
  }

  if (!traveler_id || !sender_id) {
    throw new Error('Could not determine traveler and sender for this deal');
  }

  if (traveler_id === sender_id) {
    throw new Error('You cannot create a deal with yourself');
  }

  const result = await pool.query(
    `INSERT INTO deals (connection_id, trip_id, request_id, traveler_id, sender_id, status)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [connection_id, trip_id, request_id, traveler_id, sender_id, 'pending']
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
     LEFT JOIN trips ON deals.trip_id = trips.id
     LEFT JOIN requests ON deals.request_id = requests.id
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

  const updatedResult = await pool.query(
    `UPDATE deals
     SET status = $1
     WHERE id = $2
     RETURNING *`,
    [new_status, deal_id]
  );

  const updatedDeal = updatedResult.rows[0];

  if (new_status === 'completed') {
    if (updatedDeal.trip_id) {
      await pool.query(
        `UPDATE connections
         SET status = 'cancelled_due_to_listing_closure'
         WHERE trip_id = $1
           AND id <> $2
           AND status IN ('pending', 'accepted')`,
        [updatedDeal.trip_id, updatedDeal.connection_id]
      );
    }

    if (updatedDeal.request_id) {
      await pool.query(
        `UPDATE connections
         SET status = 'cancelled_due_to_listing_closure'
         WHERE request_id = $1
           AND id <> $2
           AND status IN ('pending', 'accepted')`,
        [updatedDeal.request_id, updatedDeal.connection_id]
      );
    }
  }

  return updatedDeal;
};

module.exports = {
  createDeal,
  getDeals,
  updateDealStatus,
};