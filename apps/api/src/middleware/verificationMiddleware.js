const pool = require('../config/db');

const requireVerifiedUser = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT verification_status FROM users WHERE id = $1',
      [req.user.id]
    );

    const user = result.rows[0];

    if (!user || user.verification_status !== 'verified') {
      return res.status(403).json({
        message: 'Verify your identity before creating or accepting listings',
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = requireVerifiedUser;
