const pool = require('../config/db');
const verificationService = require('../services/verificationService');

const getMe = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT id, full_name, email, verification_status, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    res.status(200).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

const verify = async (req, res, next) => {
  try {
    const user = await verificationService.submitVerification(req.user.id);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

module.exports = { getMe, verify };
