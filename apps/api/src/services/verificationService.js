const pool = require('../config/db');
const provider = require('./verificationProviders/mockProvider');

const submitVerification = async (userId) => {
  const { status, reference } = await provider.submit(userId);

  const result = await pool.query(
    `UPDATE users
     SET verification_status = $1, verification_reference = $2
     WHERE id = $3
     RETURNING id, full_name, email, verification_status, created_at`,
    [status, reference, userId]
  );

  return result.rows[0];
};

module.exports = { submitVerification };
