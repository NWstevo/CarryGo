const pool = require('../config/db');
const auditService = require('./auditService');

/* =========================
   CREATE DEAL
========================= */
const createDeal = async ({ connection_id, current_user_id, ip, userAgent }) => {
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

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const result = await client.query(
      `INSERT INTO deals (connection_id, trip_id, request_id, traveler_id, sender_id, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [connection_id, trip_id, request_id, traveler_id, sender_id, 'pending']
    );

    const deal = result.rows[0];

    // Close the ad now that the parties have committed to a deal
    if (trip_id) {
      const tripUpdate = await client.query(
        `UPDATE trips SET status = 'booked' WHERE id = $1 AND status = 'active' RETURNING id`,
        [trip_id]
      );

      if (tripUpdate.rows.length === 0) {
        throw new Error('This trip is no longer available');
      }
    }

    if (request_id) {
      const requestUpdate = await client.query(
        `UPDATE requests SET status = 'booked' WHERE id = $1 AND status = 'active' RETURNING id`,
        [request_id]
      );

      if (requestUpdate.rows.length === 0) {
        throw new Error('This request is no longer available');
      }
    }

    // Any other sender/traveler still pending on the same ad is resolved out
    const closedConnections = await client.query(
      `UPDATE connections
       SET status = 'cancelled_due_to_listing_closure'
       WHERE (trip_id = $1 OR request_id = $2)
         AND id <> $3
         AND status = 'pending'
       RETURNING id`,
      [trip_id, request_id, connection_id]
    );

    for (const row of closedConnections.rows) {
      await auditService.record(
        {
          entityType: 'connection',
          entityId: row.id,
          event: 'cancelled_due_to_listing_closure',
          actorUserId: null,
          metadata: { closed_by_deal_id: deal.id },
        },
        client
      );
    }

    await auditService.record(
      {
        entityType: 'deal',
        entityId: deal.id,
        event: 'created',
        actorUserId: current_user_id,
        ip,
        userAgent,
        metadata: { connection_id, trip_id, request_id },
      },
      client
    );

    await client.query('COMMIT');

    return deal;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

/* =========================
   GET DEALS
========================= */
const getDeals = async (current_user_id) => {
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
     WHERE deals.traveler_id = $1 OR deals.sender_id = $1
     ORDER BY deals.created_at DESC`,
    [current_user_id]
  );

  return result.rows;
};

/* =========================
   UPDATE DEAL STATUS
========================= */
const updateDealStatus = async ({ deal_id, new_status, current_user_id, ip, userAgent }) => {
  const result = await pool.query(
    'SELECT * FROM deals WHERE id = $1',
    [deal_id]
  );

  const deal = result.rows[0];

  if (!deal) {
    throw new Error('Deal not found');
  }

  const finalStates = ['completed', 'cancelled', 'disputed'];

  if (finalStates.includes(deal.status)) {
    throw new Error(`Deal is already ${deal.status} and cannot be updated`);
  }

  if (deal.status === new_status) {
    throw new Error('Deal is already in this status');
  }

  const isTraveler = deal.traveler_id === current_user_id;
  const isSender = deal.sender_id === current_user_id;

  if (!isTraveler && !isSender) {
    throw new Error('You are not allowed to update this deal');
  }

  const allowedTransitions = {
    pending: ['agreed', 'cancelled'],
    agreed: ['in_transit', 'cancelled', 'disputed'],
    in_transit: ['delivered', 'disputed'],
    delivered: ['completed', 'disputed'],
    completed: [],
    cancelled: [],
    disputed: []
  };

  if (!allowedTransitions[deal.status].includes(new_status)) {
    throw new Error(
      `Cannot change deal status from ${deal.status} to ${new_status}`
    );
  }

  if (new_status === 'in_transit' && !isTraveler) {
    throw new Error('Only the traveler can mark the deal as in transit');
  }

  if (new_status === 'delivered' && !isTraveler) {
    throw new Error('Only the traveler can mark the deal as delivered');
  }

  if (new_status === 'completed' && !isSender) {
    throw new Error('Only the sender can confirm completion');
  }

  const updatedResult = await pool.query(
    `UPDATE deals
     SET status = $1
     WHERE id = $2
     RETURNING *`,
    [new_status, deal_id]
  );

  const updatedDeal = updatedResult.rows[0];

  await auditService.record({
    entityType: 'deal',
    entityId: deal_id,
    event: 'status_updated',
    actorUserId: current_user_id,
    ip,
    userAgent,
    metadata: { from: deal.status, to: new_status },
  });

  /* =========================
     REOPEN THE AD IF THE DEAL FELL THROUGH
  ========================= */
  if (new_status === 'cancelled') {
    if (updatedDeal.trip_id) {
      await pool.query(
        `UPDATE trips SET status = 'active' WHERE id = $1`,
        [updatedDeal.trip_id]
      );
    }

    if (updatedDeal.request_id) {
      await pool.query(
        `UPDATE requests SET status = 'active' WHERE id = $1`,
        [updatedDeal.request_id]
      );
    }
  }

  return updatedDeal;
};

/* =========================
   EXPORTS
========================= */
module.exports = {
  createDeal,
  getDeals,
  updateDealStatus,
};
