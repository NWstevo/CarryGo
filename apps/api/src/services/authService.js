const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const issueSession = (user) => {
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return {
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      verification_status: user.verification_status,
    },
  };
};

const signup = async ({ full_name, email, password, terms_accepted }) => {
  if (!terms_accepted) {
    throw new Error('You must accept the Terms of Service and Privacy Policy to sign up');
  }

  const existingUser = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );

  if (existingUser.rows.length > 0) {
    throw new Error('Email already exists');
  }

  const password_hash = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users (full_name, email, password_hash, terms_accepted_at)
     VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
     RETURNING id, full_name, email, verification_status, created_at`,
    [full_name, email, password_hash]
  );

  return result.rows[0];
};

const login = async ({ email, password }) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );

  const user = result.rows[0];

  if (!user) {
    throw new Error('Invalid email or password');
  }

  if (!user.password_hash) {
    throw new Error('This account uses Google sign-in. Please continue with Google.');
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);

  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  return issueSession(user);
};

const loginWithGoogle = async ({ credential, terms_accepted }) => {
  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (!payload || !payload.email_verified) {
    throw new Error('Google account email is not verified');
  }

  const { sub: google_id, email, name } = payload;

  const byGoogleId = await pool.query('SELECT * FROM users WHERE google_id = $1', [google_id]);

  if (byGoogleId.rows.length > 0) {
    return issueSession(byGoogleId.rows[0]);
  }

  const byEmail = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

  if (byEmail.rows.length > 0) {
    const linked = await pool.query(
      `UPDATE users SET google_id = $1 WHERE id = $2
       RETURNING id, full_name, email, verification_status`,
      [google_id, byEmail.rows[0].id]
    );

    return issueSession(linked.rows[0]);
  }

  if (!terms_accepted) {
    throw new Error('You must accept the Terms of Service and Privacy Policy to sign up');
  }

  const created = await pool.query(
    `INSERT INTO users (full_name, email, google_id, terms_accepted_at)
     VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
     RETURNING id, full_name, email, verification_status`,
    [name || email, email, google_id]
  );

  return issueSession(created.rows[0]);
};

module.exports = { signup, login, loginWithGoogle };
