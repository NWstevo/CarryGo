const pool = require('../config/db');

const record = async (
  { entityType, entityId, event, actorUserId, ip, userAgent, metadata },
  client = pool
) => {
  await client.query(
    `INSERT INTO audit_logs (entity_type, entity_id, event, actor_user_id, ip_address, user_agent, metadata)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      entityType,
      entityId,
      event,
      actorUserId || null,
      ip || null,
      userAgent || null,
      metadata ? JSON.stringify(metadata) : null,
    ]
  );
};

module.exports = { record };
