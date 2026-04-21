const validateSignup = (req, res, next) => {
  const { full_name, email, password } = req.body;

  if (!full_name || full_name.trim() === '') {
    return res.status(400).json({ message: 'Full name is required' });
  }

  if (!email || email.trim() === '') {
    return res.status(400).json({ message: 'Email is required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Please provide a valid email' });
  }

  if (!password || password.trim() === '') {
    return res.status(400).json({ message: 'Password is required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || email.trim() === '') {
    return res.status(400).json({ message: 'Email is required' });
  }

  if (!password || password.trim() === '') {
    return res.status(400).json({ message: 'Password is required' });
  }

  next();
};

const validateTrip = (req, res, next) => {
  const { origin, destination, departure_date, available_weight } = req.body;

  if (!origin || origin.trim() === '') {
    return res.status(400).json({ message: 'Origin is required' });
  }

  if (!destination || destination.trim() === '') {
    return res.status(400).json({ message: 'Destination is required' });
  }

  if (!departure_date || departure_date.trim() === '') {
    return res.status(400).json({ message: 'Departure date is required' });
  }

  if (available_weight === undefined || available_weight === null || available_weight === '') {
    return res.status(400).json({ message: 'Available weight is required' });
  }

  if (isNaN(available_weight) || Number(available_weight) <= 0) {
    return res.status(400).json({ message: 'Available weight must be a positive number' });
  }

  next();
};
const validateRequest = (req, res, next) => {
  const { origin, destination, target_date, item_name, item_weight, budget } = req.body;

  if (!origin || origin.trim() === '') {
    return res.status(400).json({ message: 'Origin is required' });
  }

  if (!destination || destination.trim() === '') {
    return res.status(400).json({ message: 'Destination is required' });
  }

  if (!target_date || target_date.trim() === '') {
    return res.status(400).json({ message: 'Target date is required' });
  }

  if (!item_name || item_name.trim() === '') {
    return res.status(400).json({ message: 'Item name is required' });
  }

  if (item_weight === undefined || item_weight === null || item_weight === '') {
    return res.status(400).json({ message: 'Item weight is required' });
  }

  if (isNaN(item_weight) || Number(item_weight) <= 0) {
    return res.status(400).json({ message: 'Item weight must be a positive number' });
  }

  if (budget === undefined || budget === null || budget === '') {
    return res.status(400).json({ message: 'Budget is required' });
  }

  if (isNaN(budget) || Number(budget) <= 0) {
    return res.status(400).json({ message: 'Budget must be a positive number' });
  }

  next();
};
const validateDeal = (req, res, next) => {
  const { trip_id, request_id } = req.body;

  if (!trip_id || trip_id.trim() === '') {
    return res.status(400).json({ message: 'Trip ID is required' });
  }

  if (!request_id || request_id.trim() === '') {
    return res.status(400).json({ message: 'Request ID is required' });
  }

  next();
};
const validateMessage = (req, res, next) => {
  const { content } = req.body;

  if (!content || content.trim() === '') {
    return res.status(400).json({ message: 'Message content is required' });
  }

  next();
};
module.exports = {
  validateSignup,
  validateLogin,
  validateTrip,
  validateRequest,
  validateDeal,
  validateMessage
};

