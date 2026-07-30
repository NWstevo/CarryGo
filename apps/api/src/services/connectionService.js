const pool = require('../config/db');
const itemCategoryService = require('./itemCategoryService');
const auditService = require('./auditService');

// Create connection for a trip
const createTripConnection = async ({
  trip_id,
  initiator_id,
  message,
  item_category,
  declared_value,
  item_origin_country,
  ip,
  userAgent,
}) => {
  const tripResult = await pool.query(
    'SELECT * FROM trips WHERE id = $1',
    [trip_id]
  );

  const trip = tripResult.rows[0];

  if (!trip) {
    throw new Error('Trip not found');
  }

  if (trip.traveler_id === initiator_id) {
    throw new Error('You cannot connect to your own trip');
  }

  await itemCategoryService.assertCategoryAllowed(item_category);

  const result = await pool.query(
    `INSERT INTO connections
     (trip_id, initiator_id, receiver_id, initiator_role, receiver_role, message,
      item_category, declared_value, item_origin_country)
     VALUES ($1, $2, $3, 'sender', 'traveler', $4, $5, $6, $7)
     RETURNING *`,
    [trip_id, initiator_id, trip.traveler_id, message || null, item_category, declared_value, item_origin_country]
  );

  const connection = result.rows[0];

  await auditService.record({
    entityType: 'connection',
    entityId: connection.id,
    event: 'created',
    actorUserId: initiator_id,
    ip,
    userAgent,
    metadata: { trip_id, item_category, declared_value },
  });

  return connection;
};

// Create connection for a request
const createRequestConnection = async ({
  request_id,
  initiator_id,
  message,
  item_category,
  declared_value,
  item_origin_country,
  ip,
  userAgent,
}) => {
  const requestResult = await pool.query(
    'SELECT * FROM requests WHERE id = $1',
    [request_id]
  );

  const request = requestResult.rows[0];

  if (!request) {
    throw new Error('Request not found');
  }

  if (request.sender_id === initiator_id) {
    throw new Error('You cannot connect to your own request');
  }

  await itemCategoryService.assertCategoryAllowed(item_category);

  const result = await pool.query(
    `INSERT INTO connections
     (request_id, initiator_id, receiver_id, initiator_role, receiver_role, message,
      item_category, declared_value, item_origin_country)
     VALUES ($1, $2, $3, 'traveler', 'sender', $4, $5, $6, $7)
     RETURNING *`,
    [request_id, initiator_id, request.sender_id, message || null, item_category, declared_value, item_origin_country]
  );

  const connection = result.rows[0];

  await auditService.record({
    entityType: 'connection',
    entityId: connection.id,
    event: 'created',
    actorUserId: initiator_id,
    ip,
    userAgent,
    metadata: { request_id, item_category, declared_value },
  });

  return connection;
};

// Get sent connections
const getSentConnections = async (user_id) => {
  const result = await pool.query(
    'SELECT * FROM connections WHERE initiator_id = $1 ORDER BY created_at DESC',
    [user_id]
  );
  return result.rows;
};

// Get received connections
const getReceivedConnections = async (user_id) => {
  const result = await pool.query(
    'SELECT * FROM connections WHERE receiver_id = $1 ORDER BY created_at DESC',
    [user_id]
  );
  return result.rows;
};

// Update status
const updateConnectionStatus = async ({ connection_id, user_id, new_status, ip, userAgent }) => {
  const result = await pool.query(
    'SELECT * FROM connections WHERE id = $1',
    [connection_id]
  );

  const connection = result.rows[0];

  if (!connection) {
    throw new Error('Connection not found');
  }

  // Only receiver can accept/reject
  if (
    (new_status === 'accepted' || new_status === 'rejected') &&
    connection.receiver_id !== user_id
  ) {
    throw new Error('Only the receiver can accept or reject this connection');
  }

  // Only initiator can cancel
  if (new_status === 'cancelled' && connection.initiator_id !== user_id) {
    throw new Error('Only the initiator can cancel this connection');
  }

  if (connection.status !== 'pending') {
    throw new Error('Only pending connections can be updated');
  }

  if (new_status === 'accepted') {
    // Re-confirm the declared category is still allowed at accept time,
    // in case the prohibited-items list changed since the connection was created.
    await itemCategoryService.assertCategoryAllowed(connection.item_category);
  }

  const updated = await pool.query(
    new_status === 'accepted'
      ? `UPDATE connections SET status = $1, accept_reconfirmed_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`
      : `UPDATE connections SET status = $1 WHERE id = $2 RETURNING *`,
    [new_status, connection_id]
  );

  const updatedConnection = updated.rows[0];

  await auditService.record({
    entityType: 'connection',
    entityId: connection_id,
    event: new_status,
    actorUserId: user_id,
    ip,
    userAgent,
  });

  return updatedConnection;
};

module.exports = {
  createTripConnection,
  createRequestConnection,
  getSentConnections,
  getReceivedConnections,
  updateConnectionStatus,
};
