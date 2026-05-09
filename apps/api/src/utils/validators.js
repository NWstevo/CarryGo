const isValidUUID = (value) => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  return typeof value === 'string' && uuidRegex.test(value);
};

const isValidFutureDate = (value) => {
  if (!value) return false;

  const date = new Date(value);
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  return !isNaN(date.getTime()) && date >= today;
};

const isStrongPassword = (password) => {
  return (
    typeof password === 'string' &&
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password)
  );
};

module.exports = {
  isValidUUID,
  isValidFutureDate,
  isStrongPassword,
};